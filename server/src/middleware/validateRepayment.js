import DB from '../database/dbconnection';

/**
 * @class ValidateRepayment
 * @description Intercepts and validates a given request for Repayment endpoints
 * @exports ValidateRepayment
 */
export default class ValidateRepayment {
  /**
   * @method validateRepayBody
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static async validateRepayBody(req, res, next) {
    req
      .checkParams('id').isUUID()
      .withMessage('Id should be a valid UUID');
    req
      .checkBody('loanId').notEmpty()
      .withMessage('Specify LoanId for this transaction')
      .isUUID()
      .withMessage('LoanId should be a valid UUID');
    req
      .checkBody('paidAmount').notEmpty()
      .withMessage('Enter amount to be repaid')
      .isNumeric()
      .withMessage('paidAmount should be an integer');
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
      return;
    }
    next();
  }

  /**
   * @method validateRepayCredentials
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static async validateRepayCredentials(req, res, next) {
    const { id } = req.params;
    const paidAmount = parseInt(req.body.paidAmount, 10);
    const checkQuery = `SELECT * FROM loans WHERE id='${id}'`;

    const check = await DB.query(checkQuery);
    if (check.rows.length < 1) {
      res.status(404).json({ status: 404, error: 'Loan record not found' });
      return;
    }
    if (check.rows[0].status !== 'approved') {
      res.status(422).json({ error: 'Loan request is not approved!' });
      return;
    }
    if (paidAmount !== check.rows[0].paymentinstallment) {
      res.status(409).json({
        error: `You are supposed to pay ${check.rows[0].paymentinstallment} monthly`,
      });
      return;
    }
    if (check.rows[0].repaid === true) {
      res.status(409).json({ status: 409, error: 'Loan already repaid' });
      return;
    }
    const [loan] = check.rows;
    req.loan = loan;
    next();
  }
}
