import { Pool, types } from 'pg';
import DBConfig from './config';

console.log('dbconnection ->', process.env.NODE_ENV);

const pool = new Pool(DBConfig);

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
