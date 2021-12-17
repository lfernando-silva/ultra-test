/*
Delete all registers from tables that are being tested.

Should not be used in production.
*/

import { getConnection } from 'typeorm';

const truncatableParentTables = [];
const truncatableTables = ['game'];

export default async function truncate(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('This operation should be executed only in tests!!!');
  }
  const parentTruncations = truncatableParentTables.map((table) =>
    getConnection().manager.query(`DELETE FROM ${table}`),
  );

  const truncations = truncatableTables.map((table) =>
    getConnection().manager.query(`DELETE FROM ${table}`),
  );

  await Promise.all(parentTruncations);
  await Promise.all(truncations);
}
