import { randomUUID } from "crypto";
import db from "../../../data/db";
import type { Account } from "../../../types/account";

export type CreateAccountArgs = {
  username: string;
  password: string;
  name?: string;
};

export type CreateAccountResult = {
  id: string;
  username: string;
  name?: string;
  created: Date;
};

export async function createAccount(args: CreateAccountArgs): Promise<CreateAccountResult> {
  const { username, password, name } = args;

  // Check if account already exists
  const existing = await db.accounts.find(username);
  if (existing) {
    throw new Error(`Account with username '${username}' already exists`);
  }

  const account: Partial<Account> = {
    id: randomUUID(),
    username,
    password,
    name,
  };

  const created = await db.accounts.create(account);

  return {
    id: created.id,
    username: created.username,
    name: created.name,
    created: created.created,
  };
}
