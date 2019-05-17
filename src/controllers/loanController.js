import Loan from '../models/Loan';

/**
 * @class LoanController
 * @description specifies which method handles a request for the Loan endpoints
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
    const { email, firstName, lastName } = req.user;
    const { amount, tenor } = req.body;

    if (Loan.findByEmail(email)) {
      return res.status(409).json({
        status: 409,
        error: "You've already applied for a loan",
      });
    }

    const newLoan = Loan.create({ email, amount, tenor });
    return res.status(201).json({
      status: 201,
      data: {
        message: "Loan request received. We'll get back to you shortly.",
        loanId: newLoan.id,
        firstName,
        lastName,
        email: newLoan.email,
        amount: newLoan.amount,
        interest: newLoan.interest,
        tenor: newLoan.tenor,
        paymentInstallment: newLoan.paymentInstallment,
        balance: newLoan.balance,
        status: newLoan.status,
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
    Loan.findQuery(status, repaid);

    return res.status(200).json({
      status: 200,
      data: Loan.all(),
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
      return res
        .status(404).json({ status: 404, error: 'Loan record not found!' });
    }

    return res.status(200).json({ status: 200, data: loanRecord });
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
      return res
        .status(404).json({ status: 404, error: 'Loan record not found!' });
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

  /**
   * @method viewUserLoans
   * @description Fetches all loan applications for a particular user
   * @param {object} req Request object
   * @param {object} res Response object
   * @returns {object} JSON API Response
   */
  static viewUserLoans(req, res) {
    console.log(req.user);
    const { email } = req.user;
    const loanHistory = Loan.fetchLoans(email);

    if (!loanHistory) {
      return res.status(403).json({
        status: 403,
        error: "You don't have access to this resource",
      });
    }

    return res.status(200).json({
      status: 200,
      data: loanHistory,
    });
  }
}

export default LoanController;
