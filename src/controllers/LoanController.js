import Loan from '../models/Loan';

/**
 * @class LoanController
 * @description specifies which method handles a request for a specific endpoint
 * @exports LoanController
 */
class LoanController {
  /**
   * @method createLoan
   * @description Creates a loan application request
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static createLoan(req, res) {
    const newLoan = Loan.create(req.body);

    res.status(201).json({
      status: 201,
      data: {
        message: 'Loan request received. We\'ll get back to you shortly.',
        loanId: newLoan.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: newLoan.user,
        tenor: newLoan.tenor,
        amount: newLoan.amount,
        monthlyInstallment: newLoan.paymentInstallment,
        status: newLoan.status,
        balance: newLoan.balance,
        interest: newLoan.interest,
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
      return res.status(404).json({
        status: 404,
        error: 'Loan record not found',
      });
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
}

export default LoanController;
