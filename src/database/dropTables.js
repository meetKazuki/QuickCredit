const dropUsersTable = 'DROP TABLE IF EXISTS users CASCADE; ';
const dropLoansTable = 'DROP TABLE IF EXISTS loans CASCADE; ';
const dropRepaymentsTable = 'DROP TABLE IF EXISTS repayments CASCADE; ';

const dropQuery = `${dropUsersTable}${dropLoansTable}${dropRepaymentsTable}`;

export default dropQuery;
