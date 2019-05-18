import pool from './connect';
import createQuery from './createTables';
import dropQuery from './dropTables';

const queries = `${dropQuery}${createQuery}`;

pool.query(queries, () => {
  pool.end();
});
