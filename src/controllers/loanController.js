import uuidv4 from 'uuid/v4';
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

    try {
      const loanQuery = `SELECT * FROM loans WHERE email='${email}'`;
      const verify = await DB.query(loanQuery);
      if (
        !verify.rows.length || verify.rows[verify.rows.length - 1].repaid === true
      ) {
        const insertQuery = `INSERT INTO
        loans(id,email,amount,interest,status,repaid,tenor,paymentInstallment, balance)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
        const values = [
          uuidv4(),
          email,
          amount,
          loan.interest,
          loan.status,
          loan.repaid,
          tenor,
          loan.paymentInstallment,
          loan.balance,
        ];

        const create = await DB.query(insertQuery, values);
        res.status(201).json({
          message: 'Loan request created successfully',
          data: create.rows,
        });
        return;
      }
      res.status(409).json({ error: 'You already applied for a loan' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
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
      res.status(200).json({ data: [record.rows[0]] });
      return;
    }

    const records = await DB.query(loansQuery);
    res.status(200).json({ data: [records.rows] });
  }

  /**
   * @method getOneLoan
   * @description Retrieves a specific loan record by Id
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getOneLoan(req, res) {
    const { id } = req.params;
    const query = `SELECT * FROM loans WHERE id='${id}'`;

    const record = await DB.query(query);
    if (record.rowCount > 0) {
      res.status(200).json({ data: record.rows[0] });
      return;
    }
    res.status(404).json({ error: 'Loan record not found' });
  }

  /**
   * @method updateLoan
   * @description Edit the status of a loan record
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {object} JSON API Response
   */
  static async updateLoan(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const query = `SELECT * FROM loans WHERE id='${id}'`;
    const update = `UPDATE loans
      SET status='${status}' WHERE id='${id}' RETURNING *`;

    const fetchLoan = await DB.query(query);
    if (!fetchLoan.rows.length) {
      res.status(404).json({ error: 'Loan record not found' });
      return;
    }
    if (fetchLoan.rows[0].status === 'approved') {
      res.status(409).json({ error: 'Loan is already approved' });
      return;
    }

    const { rows } = await DB.query(update);
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
