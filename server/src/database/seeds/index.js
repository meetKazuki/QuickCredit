import '@babel/polyfill';
import uuidv4 from 'uuid/v4';
import debug from 'debug';
import DB from '../dbconnection';

import createTables from '../migrations/createTables';
import dropTables from '../migrations/dropTables';
import HelperUtils from '../../utils/helperUtils';

const Debug = debug('DB_SEEDING');
const adminPassword = HelperUtils.hashPassword('admin');
const userPassword = HelperUtils.hashPassword('user');

const createUsers = `
  INSERT INTO users(id,firstname,lastname,address,email,password,isadmin,status)
  VALUES('${uuidv4()}','admin','admin','12 Admin Location,Sabo-Yaba,Lagos','admin@admin.com','${adminPassword}','true','verified'),('${uuidv4()}','Obito', 'Uchiha','Cave-45 Akatsuki Cavern, Amegakure','uchiha.obito@akatsuki.org','${userPassword}','false','unverified');`;

const createRecord = `
  INSERT INTO loans(id, email,status,repaid,tenor,amount,paymentInstallment,balance, interest)
  VALUES('${uuidv4()}','uchiha.obito@akatsuki.org','pending','false',3,20000,7000,21000,1000),('${uuidv4()}','uchiha.obito@akatsuki.org','approved','true',3,20000,7000,21000,1000),('${uuidv4()}','uchiha.obito@akatsuki.org','rejected','false',3,20000,7000,21000,1000);`;

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
