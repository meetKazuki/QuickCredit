import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool;
if (process.env.NODE_ENV === 'test') {
  pool = new Pool({
    connectionString: process.env.TEST_DB_URL,
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

types.setTypeParser(1700, val => parseFloat(val));

export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
