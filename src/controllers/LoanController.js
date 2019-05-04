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
    res.status(200).json({
      status: 200,
      data: Loan.all(),
    });
  }
}

export default LoanController;
