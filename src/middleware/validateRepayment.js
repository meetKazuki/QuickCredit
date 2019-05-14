import Loan from '../models/Loan';

/**
 * @class ValidateRepayment
 * @description Intercepts and validates a given request for Repayment endpoints
 * @exports ValidateRepayment
 */
export default class ValidateRepayment {
  /**
   * @method validateRepaymentID
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateRepaymentID(req, res, next) {
    req
      .checkParams('id')
      .isNumeric()
      .withMessage('Invalid ID type specified');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, error: errors[0].msg });
    }
    return next();
  }

  /**
   * @method validateRepayCredentials
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateRepayCredentials(req, res, next) {
    const loanID = parseInt(req.params.id, 10);
    const loanRecord = Loan.find(loanID);
    const { paidAmount } = req.body;

    if (!loanRecord) {
      return res.status(404).json({ status: 404, error: 'Loan record not found' });
    }
    if (loanRecord.status !== 'approved') {
      return res.status(422).json({
        status: 422,
        error: 'Loan request is not even approved!',
      });
    }
    if (paidAmount > loanRecord.paymentInstallment) {
      return res.status(409).json({
        status: 409,
        error: `You are supposed to pay ${loanRecord.paymentInstallment} monthly`,
      });
    }
    if (loanRecord.repaid === true) {
      return res.status(409).json({ status: 409, error: 'Loan already repaid' });
    }

    return next();
  }
}
