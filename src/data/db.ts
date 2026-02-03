import { Container, CosmosClient } from '@azure/cosmos';
import { logInfo, logError, logDebug, logWarning } from '../lib/logger';
import KvdConfiguration from '../config';
import { Account, Track } from '../types';
import { DefaultAzureCredential } from '@azure/identity';

let containers: Record<string, Container> = {};
let client: CosmosClient | null = null;

const cosmosUrl = KvdConfiguration.azure.cosmos.url;

const trackRepository = {
  async list(): Promise<Track[]> {
    const container = await getContainer('tracks');

    try {
      const query = 'SELECT * FROM c';
      const { resources: tracks } = await container.items.query(query).fetchAll();
      return tracks as Track[];
    } catch (error) {
      logError(`Error retrieving all tracks: ${error}`);
      throw error;
    }
  },

  async listByUser(username: string): Promise<Track[]> {
    const container = await getContainer('tracks');

    try {
      const query = `SELECT * FROM c WHERE ARRAY_CONTAINS(c.source.users, @username)`;
      const { resources: tracks } = await container.items.query({
        query,
        parameters: [{ name: '@username', value: username }],
      }).fetchAll();
      return tracks as Track[];
    } catch (error) {
      logError(`Error retrieving tracks for user '${username}': ${error}`);
      throw error;
    }
  },

  async create(track: Track) {
    const container = await getContainer('tracks');

    try {
      await container.items.create(track);
    } catch (error) {
      logError(`Error inserting track: ${error}`);
    }
  },

  async remove(id: string, slug: string) {
    const container = await getContainer('tracks');

    try {
      await container.item(id, slug).delete();
      logInfo(`Deleted track: ${slug}`);
    } catch (error) {
      logError(`Error deleting track: ${error}`);
    }
  },

  async find(slug: string): Promise<Track | null> {
    const container = await getContainer('tracks');

    try {
      const query = `SELECT TOP 1 * FROM c WHERE c.slug = @slug`;
      const { resources: tracks } = await container.items.query({
        query,
        parameters: [{ name: '@slug', value: slug }],
      }, { maxItemCount: 1 }).fetchAll();

      const track = tracks[0] as Track || null;
      if (track) {
        logDebug(`Track with slug '${slug}' found. Id: '${track.id}'`);
      } else {
        logWarning(`Track with slug '${slug}' not found.`);
      }
      return track;

    } catch (error) {
      logError(`Error fetching track by slug '${slug}': ${error}`);
      throw error;
    }
  },

  async update(id: string, slug: string, updatedTrack: any, partial: boolean = false) {
    const container = await getContainer('tracks');

    try {
      if (partial) {
        await container.item(id, slug).patch(updatedTrack);
        logDebug(`Patched track: ${id}`);
      } else {
        await container.item(id, slug).replace(updatedTrack);
        logDebug(`Replaced track: ${id}`);
      }
    } catch (error) {
      logError(`Error updating track: ${error}`);
      throw error;
    }
  }
}

const accountRepository = {
  async list(): Promise<Account[]> {
    const container = await getContainer("accounts");
    const query = `SELECT c.id, c.name, c.username, c.created FROM c`;
    const { resources: accounts } = await container.items.query(query).fetchAll();
    return accounts as Account[];
  },

  async find(username: string): Promise<Account | null> {
    const container = await getContainer("accounts");
    const query = `SELECT TOP 1 * FROM c WHERE c.username = @username`;
    const { resources: accounts } = await container.items.query({
      query,
      parameters: [{ name: '@username', value: username }],
    }, { maxItemCount: 1 }).fetchAll();
    return accounts[0] as Account || null;
  },

  async create(account: Partial<Account>) {
    try {
      const container = await getContainer("accounts");
      account.created = new Date();
      const result = await container.items.create(account);
      return result.resource as Account;
    } catch (error) {
      logError(`Error creating account: ${error}`);
      throw error;
    }
  },

  async update(account: Account) {
    try {
      const container = await getContainer("accounts");
      account.updated = new Date();
      await container.item(account.id, account.username).replace(account);
      logDebug(`Updated account: ${account.username}`);
    } catch (error) {
      logError(`Error updating account: ${error}`);
      throw error;
    }
  },
}

async function getContainer(containerId: 'tracks' | 'accounts'): Promise<Container> {
  if (containers[containerId]) {
    return containers[containerId];
  }

  if (!client) {
    client = new CosmosClient({
      endpoint: cosmosUrl,
      aadCredentials: new DefaultAzureCredential()
    });
  }

  const database = client.database('kvd');
  containers[containerId] = database.container(containerId);
  return containers[containerId];
}

async function close() {
  if (client) {
    await client.dispose();
    client = null;
    containers = {};
    logInfo('Cosmos client closed');
  }
}

const db = {
  tracks: trackRepository,
  accounts: accountRepository,
  close
};

export default db;