import DB from '../database/dbconnection';

/**
 * @class LoanController
 * @description specifies which method handles a request for the Loan endpoints
 * @exports LoanController
 */
export default class LoanController {
  /**
   * @method createLoan
   * @description Creates a loan application request
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async createLoan(req, res) {
    const { email } = req.user;
    const { amount, tenor } = req.body;
    const loan = {
      email,
      interest: 0.05 * parseInt(amount, 10),
      get paymentInstallment() {
        return ((parseInt(amount, 10) + this.interest) / parseInt(tenor, 10));
      },
      get balance() {
        return (parseInt(this.paymentInstallment, 10) * parseInt(tenor, 10));
      },
      status: 'pending',
      repaid: false,
    };

    const loanQuery = `SELECT * FROM loans WHERE email='${email}'`;
    const verify = await DB.query(loanQuery);
    if (!verify.rows.length || verify.rows[verify.rows.length - 1].repaid === true) {
      const insertQuery = `INSERT INTO loans(email, amount, interest, status, repaid, tenor,paymentInstallment, balance)
      VALUES('${email}', '${amount}', '${loan.interest}', '${loan.status}', '${loan.repaid}', '${tenor}', '${loan.paymentInstallment}', '${loan.balance}') RETURNING *;`;

      const create = await DB.query(insertQuery);
      res.status(201).json({
        message: 'Loan request created successfully',
        data: create.rows,
      });
      return;
    }
    res.status(409).json({ error: 'You already applied for a loan' });
  }

  /**
   * @method getAllLoans
   * @description List all loan applications in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getAllLoans(req, res) {
    const statusQuery = 'SELECT * FROM loans WHERE status=$1 AND repaid=$2';
    const loansQuery = 'SELECT * FROM loans';

    const { status, repaid } = req.query;
    if (status && JSON.parse(repaid)) {
      const values = [status, repaid];
      const record = await DB.query(statusQuery, values);
      res.status(200).json({ data: record.rows[0] });
      return;
    }

    const records = await DB.query(loansQuery);
    res.status(200).json({ data: [records.rows] });
  }

  /**
   * @method getOneLoan
   * @description Retrieves a specific loan record by ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getOneLoan(req, res) {
    const query = 'SELECT * FROM loans WHERE id=$1';
    const { id } = req.params;

    const record = await DB.query(query, [id]);
    if (record.rowCount > 0) {
      res.status(200).json({ data: [record.rows[0]] });
      return;
    }
    res.status(404).json({ error: 'Loan record not found' });
  }

  /**
   * @method updateLoan
   * @description Edit the status of the loan record
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {object} JSON API Response
   */
  static async updateLoan(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'SELECT * FROM loans WHERE id=$1';
    const update = 'UPDATE loans SET status=$1 WHERE id=$2 RETURNING *';
    const values = [status, id];

    const fetchLoan = await DB.query(query, [id]);
    if (!fetchLoan.rows.length) {
      res.status(404).json({ error: 'Loan record not found' });
      return;
    }
    if (fetchLoan.rows[0].status === 'approved') {
      res.status(409).json({ error: 'Loan is already approved' });
      return;
    }

    const { rows } = await DB.query(update, values);
    res.status(201).json({
      message: 'Loan record updated',
      data: rows[0],
    });
  }

  /**
   * @method viewUserLoans
   * @description Fetches all loan applications for a particular user
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {object} JSON API Response
   */
  static async viewUserLoans(req, res) {
    const { email } = req.user;
    const query = `SELECT * FROM loans WHERE email='${email}'`;

    const loanRecords = await DB.query(query);
    res.status(200).json({ data: loanRecords.rows });
  }
}
