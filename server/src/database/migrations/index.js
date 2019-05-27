import '@babel/polyfill';
import debug from 'debug';
import DB from '../dbconnection';

import createQuery from './createTables';
import dropQuery from './dropTables';

const Debug = debug('DB_MIGRATE');

// eslint-disable-next-line consistent-return
const queryTable = async () => {
  try {
    const queries = `${dropQuery}${createQuery}`;
    const migrateTable = await DB.query(queries);
    Debug(migrateTable);
  } catch (err) {
    Debug(err.stack);
    return err.stack;
  }
};

queryTable();
