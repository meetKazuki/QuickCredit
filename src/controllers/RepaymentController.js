import Repayment from '../models/Repayment';

class RepaymentController {
  static getRepaymentHistory(req, res) {
    const { loanId } = req.params;

    const loanRecord = Repayment.find(loanId);
    if (!loanRecord) {
      return res.status(404).json({
        status: 404,
        error: 'record not found',
      });
    }

    return res.status(200).json({
      status: 200,
      data: loanRecord,
    });
  }
}

export default RepaymentController;
