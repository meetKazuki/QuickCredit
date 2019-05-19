import { Pool } from 'pg';
import debug from 'debug';
import dotenv from 'dotenv';

import createTables from './createTables';
import dropTables from './dropTables';
import HelperUtils from '../utils/helperUtils';

dotenv.config();

const Debug = debug('DB_SEEDING');
const hashedPassword = HelperUtils.hashPassword('secret');

const createAdmin = `
  INSERT INTO users(firstname, lastname, address, email, password, isadmin, status)  VALUES('Desmond', 'Edem', 'Sabo', 'meetdesmond.edem@gmail.com', '$2a$10$7gavyoENvyqMmcYHGR6uweEQ1gxkW5yll7VSXEqQYWnID1lAz1dJW', 'true', 'verified');`;
const createUser = `
  INSERT INTO users(firstname, lastname, address, email, password, isadmin, status)
  VALUES('Obito', 'Uchiha', 'ANBU HQ', 'uchiha.obito@anbu.org', ${hashedPassword}, 'false', 'unverified')`;

const queries = `${dropTables}${createTables}${createAdmin}${createUser}`;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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

/**
 * secret - $2a$10$7gavyoENvyqMmcYHGR6uweEQ1gxkW5yll7VSXEqQYWnID1lAz1dJW
 */
