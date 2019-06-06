import uuidv4 from 'uuid/v4';
import DB from '../database/dbconnection';

/**
 * @class RepaymentController
 * @description specifies which method handles a request for the Loan endpoints
 * @exports RepaymentController
 */
export default class RepaymentController {
  /**
   * @method postRepayment
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async postRepayment(req, res) {
    const { id } = req.params;
    const paidAmount = parseInt(req.body.paidAmount, 10);
    const query = `SELECT * FROM loans WHERE id='${id}'`;
    let repaid = false;

    const check = await DB.query(query);
    const newBalance = check.rows[0].balance - paidAmount;
    const loanQuery = `UPDATE loans SET repaid=$1, balance=$2
                      WHERE id=$3 RETURNING *`;

    if (newBalance <= 0) {
      repaid = true;
    } else check.rows[0].balance -= paidAmount;

    const repayValues = [repaid, newBalance, id];
    const updateQuery = await DB.query(loanQuery, repayValues);
    const insert = `INSERT into repayments(id, loanId, amount)
      VALUES($1, $2, $3) RETURNING *`;
    const paymentValues = [uuidv4(), id, paidAmount];
    const repayment = await DB.query(insert, paymentValues);

    res.status(201).json({
      status: 201,
      message: 'Payment successfully made',
      data: {
        id: repayment.rows[0].id,
        loanid: repayment.rows[0].loanid,
        createdon: repayment.rows[0].createdon,
        amount: updateQuery.rows[0].amount,
        monthlyinstallment: updateQuery.rows[0].paymentinstallment,
        paidamount: repayment.rows[0].amount,
        balance: updateQuery.rows[0].balance,
      },
    });
  }

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
      res.status(403).json({
        status: 403,
        error: 'You are not authorized',
      });
      return;
    }

    const { rows, rowCount } = await DB.query(query);
    if (rowCount < 1) {
      res.status(404).json({
        status: 404,
        error: 'No repayment history for loan',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: [...rows],
    });
  }
}
