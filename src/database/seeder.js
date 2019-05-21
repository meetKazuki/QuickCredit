
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
  INSERT INTO users(firstname, lastname, address, email, password, isadmin, status)  VALUES('Desmond', 'Edem', 'Sabo', 'meetdesmond.edem@gmail.com', '${hashedPassword}', 'true', 'verified');`;

const createUser = `
  INSERT INTO users(firstname, lastname, address, email, password, isadmin, status)
  VALUES('Obito', 'Uchiha', 'ANBU HQ', 'uchiha.obito@akatsuki.org', '${hashedPassword}', 'false', 'unverified');`;

const createRecord = `
  INSERT INTO loans(email, status, repaid, tenor, amount,paymentInstallment, balance, interest)
  VALUES('uchiha.obito@akatsuki.org', 'approved', 'false', 3, 20000,7000, 21000, 1000);`;

const createRepayment = 'INSERT INTO repayments(loanId, amount) VALUES(1, 7000);';

const queries = `${dropTables}${createTables}${createAdmin}${createUser}${createRecord}${createRepayment}`;
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
