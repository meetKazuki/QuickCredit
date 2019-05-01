import DB from '../database';

export default class Loan {
  /**
   * Creates an instance of Loan
   *
   * @param {object} attributes loan attributes
   */
  constructor() {
    Loan.incrementCount();
    this.id = Loan.count;
    this.createdOn = Date();
    this.repaid = false;
    this.status = 'pending';
  }

  static incrementCount() {
    Loan.count += 1;
  }
}

Loan.table = DB.loans;
Loan.count = 0;
