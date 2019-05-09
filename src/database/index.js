import HelperUtils from '../utils/HelperUtils';

const DB = {
  users: [
    {
      id: 1,
      firstName: 'Desmond',
      lastName: 'Edem',
      email: 'meetdesmond.edem@gmail.com',
      password: HelperUtils.hashPassword('secret'),
      address: '12 McNeil Street, Sabo-Yaba, Lagos',
      status: 'verified',
      isAdmin: true,
    },
  ],
  loans: [],
  repayments: [
    {
      id: 1,
      loanId: 1,
      createdOn: 'April 25, 2019 1:32 AM',
      amount: '200000',
      monthlyInstallments: '26666.667',
      paidAmount: 60000,
      balance: 140000,
    },
    {
      id: 2,
      loanId: 1,
      createdOn: 'April 25, 2019 1:32 AM',
      amount: '200000',
      monthlyInstallments: '26666.667',
      paidAmount: 60000,
      balance: 140000,
    },
    {
      id: 3,
      loanId: 1,
      createdOn: 'April 25, 2019 1:32 AM',
      amount: '200000',
      monthlyInstallments: '26666.667',
      paidAmount: 60000,
      balance: 140000,
    },
    {
      id: 4,
      loanId: 2,
      createdOn: 'April 25, 2019 1:32 AM',
      amount: '200000',
      monthlyInstallments: '26666.667',
      paidAmount: 60000,
      balance: 140000,
    },
  ],
};

export default DB;
