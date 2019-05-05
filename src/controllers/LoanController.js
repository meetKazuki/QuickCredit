import Loan from '../models/Loan';

/**
 * @class LoanController
 * @description specifies which method handles a request for a specific endpoint
 * @exports LoanController
 */
class LoanController {
  /**
   * @method getAllLoans
   * @description List all loan applications in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAllLoans(req, res) {
    const { status, repaid } = req.query;
    if (status && repaid) {
      const response = Loan.findQuery(status, JSON.parse(repaid));

      return res.status(200).json({
        status: 200,
        data: [response],
      });
    }
    return res.status(200).json({
      status: 200,
      data: [Loan.all()],
    });
  }

  /**
   * @method getOneLoan
   * @description Retrieves a specific loan record by ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getOneLoan(req, res) {
    const loanRecord = Loan.find(parseInt(req.params.id, 10));

    if (!loanRecord) {
      return res.status(404).json({
        status: 404,
        error: 'Loan record not found',
      });
    }

    return res.status(200).json({
      status: 200,
      data: loanRecord,
    });
  }
}

export default LoanController;
