import { Pool } from 'pg';
import dotenv from 'dotenv';
import debug from 'debug';

import createQuery from './createTables';
import dropQuery from './dropTables';

dotenv.config();

const Debug = debug('DB_MIGRATE');
const queries = `${dropQuery}${createQuery}`;

const pool = new Pool({
  connectionString: process.env.TEST_DB_URL,
});

pool.on('connect', () => {
  Debug('connected to the db');
});

pool.query(queries)
  .then((res) => {
    Debug(res);
    pool.end();
  })
  .catch((err) => {
    Debug(err);
    pool.end();
  });

pool.on('remove', () => {
  Debug('client removed');
  process.exit(0);
});
