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
  VALUES('Obito', 'Uchiha', 'ANBU HQ', 'uchiha.obito@anbu.org', '${hashedPassword}', 'false', 'unverified')`;
const createUser = `
  INSERT INTO users(firstname, lastname, address, email, password, isadmin, status)
  VALUES('Sasuke', 'Uchiha', 'ANBU HQ', 'uchiha.sasuke@konoha.org', '$2a$10$7gavyoENvyqMmcYHGR6uweEQ1gxkW5yll7VSXEqQYWnID1lAz1dJW', 'false', 'verified');`;

const createRecord = `
  INSERT INTO loans(email, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest)
  VALUES('uchiha.sasuke@konoha.org', '2019-05-19T23:05:54.120Z', 'approved', 'false', 3, 20000, 7000, 21000, 1000);`;

const createRecord = `
  INSERT INTO loans(email, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest)
  VALUES('uchiha.obito@akatsuki.org', '2019-05-19T23:05:54.120Z', 'approved', 'true', 3, 20000, 7000, 21000, 1000);`;

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
