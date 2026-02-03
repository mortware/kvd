import db from "../data/db";

export type AccountSummary = {
  name: string | undefined;
  username: string;
};

export async function listAccounts(): Promise<AccountSummary[]> {
  const accounts = await db.accounts.list();
  return accounts.map(a => ({
    name: a.name,
    username: a.username,
  }));
}
