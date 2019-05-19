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
  static createLoan(req, res) {
    const { email, firstName, lastName } = req.user;
    const { amount, tenor } = req.body;

    if (Loan.findByEmail(email)) {
      return res.status(409).json({
        status: 409,
        error: "You've already applied for a loan",
      });
    }

    const newLoan = Loan.create({ email, amount, tenor });
    return res.status(201).json({
      status: 201,
      data: {
        message: "Loan request received. We'll get back to you shortly.",
        loanId: newLoan.id,
        firstName,
        lastName,
        email: newLoan.email,
        amount: newLoan.amount,
        interest: newLoan.interest,
        tenor: newLoan.tenor,
        paymentInstallment: newLoan.paymentInstallment,
        balance: newLoan.balance,
        status: newLoan.status,
      },
    });
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
      return res.status(200).json({ data: record.rows[0] });
    }

    const records = await DB.query(loansQuery);
    return res.status(200).json({ data: [records.rows] });
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
      return res.status(200).json({ data: [record.rows[0]] });
    }
    return res.status(404).json({ error: 'Loan record not found' });
  }

  /**
   * @method updateLoan
   * @description Edit the status of the loan record
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {object} JSON API Response
   */
  static updateLoan(req, res) {
    const loanRecord = Loan.find(parseInt(req.params.id, 10));
    if (!loanRecord) {
      return res
        .status(404).json({ status: 404, error: 'Loan record not found!' });
    }

    const data = req.body;
    loanRecord.update(data);

    return res.status(201).json({
      status: 201,
      data: {
        loanId: loanRecord.id,
        loanAmount: loanRecord.amount,
        tenor: loanRecord.tenor,
        status: loanRecord.status,
        monthlyInstallment: loanRecord.paymentInstallment,
        interest: loanRecord.interest,
      },
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
    console.log(req.user);
    const query = 'SELECT * FROM loans WHERE email=$1';
    const { email } = req.user;

    const loanRecords = await DB.query(query, [email]);
    return res.status(200).json({ data: loanRecords.rows });
  }
}
