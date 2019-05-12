import DB from '../database';

export default class Repayment {
  constructor({ loanID, paidAmount }) {
    Repayment.incrementCount();
    this.id = Repayment.count;
    this.loanID = loanID;
    this.paidAmount = parseFloat(paidAmount, 10.0);
    this.createdOn = Date.now();
  }

  static incrementCount() {
    Repayment.count += 1;
  }

  static create(attributes) {
    const repayment = new Repayment(attributes);
    Repayment.table.push(repayment);
    return repayment;
  }

  static find(id) {
    return Repayment.table.find(loan => loan.loanID === id);
  }

  static resetTable() {
    Repayment.table = [];
    Repayment.count = 0;
  }
}

Repayment.table = DB.repayments;
Repayment.count = Repayment.table.length;
