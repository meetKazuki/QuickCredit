const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128) NOT NULL,
    address VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unverified',
    isadmin BOOLEAN DEFAULT false
  );`;

const createLoansTable = `
  DROP TYPE IF EXISTS loan_status;
  CREATE TYPE loan_status as ENUM ('pending', 'approved', 'rejected');
  CREATE TABLE IF NOT EXISTS loans(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status loan_status DEFAULT 'pending',
    repaid BOOLEAN DEFAULT false,
    tenor INTEGER NOT NULL,
    amount FLOAT NOT NULL,
    paymentInstallment FLOAT NOT NULL,
    balance FLOAT NOT NULL,
    interest FLOAT NOT NULL
  );`;

const createRepaymentsTable = `
  CREATE TABLE IF NOT EXISTS repayments(
    id SERIAL PRIMARY KEY,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    loanId INTEGER REFERENCES loans(id) on DELETE CASCADE,
    amount FLOAT NOT NULL
  );`;

const createTables = `
  ${createUsersTable}${createLoansTable}${createRepaymentsTable}
`;

export default createTables;
