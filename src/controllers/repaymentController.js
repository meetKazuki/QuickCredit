import Loan from '../models/Loan';
import Repayment from '../models/Repayment';

/**
 * @class RepaymentController
 * @description specifies which method handles a request for the Repayment endpoints
 * @exports RepaymentController
 */
class RepaymentController {
  /**
   * @method postLoanRepayment
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static postLoanRepayment(req, res) {
    const loanID = parseInt(req.params.id, 10);
    const loanRecord = Loan.find(loanID);
    const { paidAmount } = req.body;

    const newBalance = loanRecord.balance - paidAmount;
    if (newBalance <= 0) {
      loanRecord.repaid = true;
      loanRecord.balance = 0;
    } else loanRecord.balance -= paidAmount;

    const data = { loanID, paidAmount };
    const repayRecord = Repayment.create(data);

    return res.status(201).json({
      status: 201,
      data: {
        id: repayRecord.id,
        loanId: repayRecord.loanID,
        createdOn: repayRecord.createdOn,
        amount: loanRecord.amount,
        monthlyInstallment: loanRecord.paymentInstallment,
        paidAmount: repayRecord.paidAmount,
        balance: loanRecord.balance,
      },
    });
  }

  /**
   * @method getRepaymentHistory
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getRepaymentHistory(req, res) {
    const loanRecord = Repayment.fetchRepayment(parseInt(req.params.id, 10));
    if (!loanRecord) {
      return res.status(404).json({ status: 404, error: 'Record not found' });
    }

    return res.status(200).json({ status: 200, data: loanRecord });
  }
}

export default RepaymentController;
