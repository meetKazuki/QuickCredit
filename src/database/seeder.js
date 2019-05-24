import { Pool } from 'pg';
import uuidv4 from 'uuid/v4';
import debug from 'debug';
import dotenv from 'dotenv';

import createTables from './createTables';
import dropTables from './dropTables';
import HelperUtils from '../utils/helperUtils';

dotenv.config();

const Debug = debug('DB_SEEDING');
const hashedPassword = HelperUtils.hashPassword('secret');

const createUsers = `
  INSERT INTO users(id, firstname, lastname, address, email, password, isadmin, status)
  VALUES('${uuidv4()}','Desmond', 'Edem', 'Sabo', 'meetdesmond.edem@gmail.com', '${hashedPassword}', 'true', 'verified'),
  ('${uuidv4()}', 'Obito', 'Uchiha', 'Akatsuki Cavern', 'uchiha.obito@akatsuki.org', '${hashedPassword}', 'false', 'unverified');`;

const createRecord = `
  INSERT INTO loans(id, email,status,repaid,tenor,amount,paymentInstallment,balance, interest)
  VALUES('${uuidv4()}','uchiha.obito@akatsuki.org','pending','false',3,20000,7000,21000,1000);`;

/* const createRepayment = `INSERT INTO repayments(id, loanid, amount)
  VALUES('04e3f4db-4046-469e-b57a-9c9f9f00b345', '171b71ad-c3e1-411b-9516-56b2061e0fc5', 7000);`; */

const queries = `${dropTables}${createTables}${createUsers}${createRecord}`;

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
