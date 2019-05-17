import DB from '../database';

export default class Loan {
  /**
   * Creates an instance of Loan
   *
   * @param {Object} attributes loan attributes
   */
  constructor({
    email, tenor, amount, status,
  }) {
    Loan.incrementCount();
    this.id = Loan.count;
    this.email = email;
    this.createdOn = Date();
    this.status = status || 'pending';
    this.repaid = false;
    this.tenor = parseInt(tenor, 10);
    this.amount = parseFloat(amount, 10.0);
    this.interest = parseFloat((0.05 * amount), 10);
    this.paymentInstallment = Math.floor(
      parseFloat((this.amount + this.interest) / this.tenor, 10),
    );
    this.balance = parseFloat((this.amount + this.interest), 10.0);
  }

  static incrementCount() {
    Loan.count += 1;
  }

  /**
   * Returns a list of loan resources
   *
   * @returns {[Loan]} a list of loan resources
   */
  static all() {
    return Loan.table;
  }

  /**
   * Creates a new resource
   *
   * @param {Object} attributes the resource attribute
   * @returns {Loan} a Loan resource
   */
  static create(attributes) {
    const loan = new Loan(attributes);
    Loan.table.push(loan);
    return loan;
  }

  /**
   * Find resource by given ID
   *
   * @param {string} id resource identity number
   * @returns {Loan} a Loan resource
   */
  static find(id) {
    return Loan.table.find(loan => loan.id === id);
  }

  /**
   * Find resource by user email
   *
   * @param {string} email resource email address
   * @returns {Loan} a Loan resource
   */
  static findByEmail(email) {
    return Loan.table.find(record => record.email === email);
  }

  /**
   * Fetch loans by email
   */
  static fetchLoans(email) {
    return Loan.table.filter(record => record.email === email);
  }

  /**
   * Find resource by query
   *
   * @param {string} status
   * @param {boolean} repaid
   * @returns {Loan} a Loan resource
   */
  static findQuery(status, repaid) {
    if (status) {
      return Loan.table.filter(result => result.status === status);
    } if (repaid) {
      return Loan.table.filter(result => result.repaid === repaid);
    }
    return Loan.table.filter(
      result => result.status === status && result.repaid === repaid,
    );
  }

  /**
   * Update resource attribues
   *
   * @param {object} data attributes to modify
   * @returns {Loan} loan resource
   */
  update(data) {
    this.balance = data.balance || this.balance;
    this.repaid = data.repaid || this.repaid;
    if (this.status === 'pending') {
      this.status = data.status || this.status;
    }

    return this;
  }

  static resetTable() {
    Loan.table = [];
    Loan.count = 0;
  }
}

Loan.table = DB.loans;
Loan.count = Loan.table.length;
