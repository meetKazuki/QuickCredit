import DB from '../database';

export default class Repayment {
  /**
   * Creates an instance of Repayment
   * @param {Object} attributes loan attributes
   */
  constructor({ loanID, paidAmount }) {
    Repayment.incrementCount();
    this.id = Repayment.count;
    this.loanID = loanID;
    this.paidAmount = parseFloat(paidAmount, 10.0);
    this.createdOn = Date();
  }

  static incrementCount() {
    Repayment.count += 1;
  }

  attribute() {
    return { ...this };
  }

  /**
   * Creates a new resource
   *
   * @param {Object} attributes the resource attribute
   * @returns {Repayment} a Repayment resource
   */
  static create(attributes) {
    const repayment = new Repayment(attributes).attribute();
    Repayment.table.push(repayment);
    return repayment;
  }

  /**
   * Find resource by given ID
   *
   * @param {string} id resource identity number
   * @returns {Repayment} a Repayment resource
   */
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
