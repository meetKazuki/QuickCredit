import DB from '../database/dbconnection';

/**
 * @class RepaymentController
 * @description specifies which method handles a request for the Loan endpoints
 * @exports RepaymentController
 */
export default class RepaymentController {
  /**
   * @method viewRepaymentsHistory
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async viewRepaymentHistory(req, res) {
    const { email } = req.user;
    const { id } = req.params;
    const user = `SELECT * FROM loans WHERE email='${email}'`;
    const query = `SELECT * FROM repayments WHERE loanId='${id}'`;

    const checkLoan = await DB.query(user);
    if (!checkLoan.rows.email === email || checkLoan.rows.isadmin === false) {
      res.status(403).json({ error: 'You are not authorized' });
      return;
    }

    const records = await DB.query(query);
    if (!records.rows.length) {
      res.status(404).json({ error: 'Loan record not found' });
      return;
    }

    res.status(200).json({ data: records.rows });
  }
}
