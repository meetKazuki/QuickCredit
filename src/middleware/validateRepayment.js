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
  static validateRepayCredentials(req, res, next) {
    const loan = parseInt(req.params.id, 10);
    const loanRecord = Loan.find(loan);
    const { paidAmount } = req.body;

    req
      .checkParams('id')
      .isNumeric()
      .withMessage('ID should be an integer');
    req
      .checkBody('loanID')
      .notEmpty()
      .withMessage('Specify LoanID for this transaction')
      .isNumeric()
      .withMessage('LoanID should be an integer');
    req
      .checkBody('paidAmount')
      .notEmpty()
      .withMessage('Enter amount to be repaid')
      .isNumeric()
      .withMessage('paidAmount should be an integer');
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
      return;
    }

    if (!loanRecord) {
      res.status(404).json({ status: 404, error: 'Loan record not found' });
      return;
    }
    if (loanRecord.status !== 'approved') {
      res.status(422).json({
        status: 422,
        error: 'Loan request is not approved!',
      });
      return;
    }
    if (paidAmount > loanRecord.paymentInstallment) {
      res.status(409).json({
        status: 409,
        error: `You are supposed to pay ${loanRecord.paymentInstallment} monthly`,
      });
      return;
    }
    if (loanRecord.repaid === true) {
      res.status(409).json({ status: 409, error: 'Loan already repaid' });
      return;
    }
    next();
  }
}
