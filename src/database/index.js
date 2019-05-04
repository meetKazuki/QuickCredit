const DB = {
  users: [{
    id: 3,
    firstName: 'Desmond',
    lastName: 'Edem',
    email: 'meetdesmond.edem@gmail.com',
    password: 'secret',
    address: '12 McNeil Street, Sabo-Yaba, Lagos',
    status: 'verified',
    isAdmin: true,
  }],
  loans: [{
    id: 1,
    user: 'uchiha.itachi@anbu.org',
    createdOn: Date(),
    status: 'pending',
    repaid: false,
    tenor: 3,
    amount: 20000.00,
    paymentInstallment: 7000,
    balance: 0.0,
    interest: 1000,
  }],
  repayments: [],
};

export default DB;
