import '@babel/polyfill';
import uuidv4 from 'uuid/v4';
import debug from 'debug';
import DB from '../dbconnection';

import createTables from '../migrations/createTables';
import dropTables from '../migrations/dropTables';
import HelperUtils from '../../utils/helperUtils';

const Debug = debug('DB_SEEDING');
const hashedPassword = HelperUtils.hashPassword('secret');

const createUsers = `
  INSERT INTO users(id, firstname, lastname, address, email, password, isadmin, status)
  VALUES('${uuidv4()}','Desmond', 'Edem', '12 McNeil Street, Sabo-Yaba, Lagos', 'meetdesmond.edem@gmail.com', '${hashedPassword}', 'true', 'verified'),
  ('${uuidv4()}', 'Obito', 'Uchiha', 'Akatsuki Cavern, Amegakure', 'uchiha.obito@akatsuki.org', '${hashedPassword}', 'false', 'unverified');`;

const createRecord = `
  INSERT INTO loans(id, email,status,repaid,tenor,amount,paymentInstallment,balance, interest)
  VALUES('${uuidv4()}','uchiha.obito@akatsuki.org','pending','false',3,20000,7000,21000,1000);`;

// eslint-disable-next-line consistent-return
const seedTable = async () => {
  try {
    const queries = `${dropTables}${createTables}${createUsers}${createRecord}`;
    const populateTable = await DB.query(queries);
    Debug(populateTable);
  } catch (err) {
    Debug(err.stack);
    return err.stack;
  }
};

seedTable();
