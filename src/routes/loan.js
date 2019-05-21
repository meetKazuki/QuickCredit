import { Router } from 'express';
import AuthenticateUser from '../middleware/authenticateUser';
import ValidateLoan from '../middleware/validateLoan';
import LoanController from '../controllers/loanController';
<<<<<<< HEAD
import ValidateRepayment from '../middleware/validateRepayment';
import RepaymentController from '../controllers/repaymentController';
=======
>>>>>>> 83d4f8bf0e8932e4b92e07a265df0e0bc9d9f6e5

const loanRouter = Router();

/* loanRouter.post(
  '/loans',
  AuthenticateUser.verifyUser,
  ValidateLoan.validateLoanApply,
  LoanController.createLoan,
<<<<<<< HEAD
);
router.post(
  '/loans/:id/repayment',
  ValidateRepayment.validateRepaymentID,
  AuthenticateUser.verifyAdmin,
  ValidateRepayment.validateRepayCredentials,
  RepaymentController.postLoanRepayment,
=======
>>>>>>> 83d4f8bf0e8932e4b92e07a265df0e0bc9d9f6e5
); */

loanRouter.get(
  '/loans',
  ValidateLoan.validateQueryOptions,
  AuthenticateUser.verifyAdmin,
  LoanController.getAllLoans,
);
loanRouter.get(
  '/loans/:id',
  ValidateLoan.validateLoanID,
  AuthenticateUser.verifyAdmin,
  LoanController.getOneLoan,
);
<<<<<<< HEAD
loanRouter.get(
  '/loans/:id/repayments',
  AuthenticateUser.verifyUser,
  ValidateRepayment.validateRepaymentID,
  RepaymentController.viewRepaymentHistory,
);
=======
/* loanRouter.get(
  '/loans/:id/repayments',
  AuthenticateUser.verifyUser,
  ValidateRepayment.validateRepaymentID,
  RepaymentController.getRepaymentHistory,
); */
>>>>>>> 83d4f8bf0e8932e4b92e07a265df0e0bc9d9f6e5

loanRouter.patch(
  '/loans/:id',
  AuthenticateUser.verifyAdmin,
  ValidateLoan.validateLoanID,
  ValidateLoan.validatePatchOptions,
  LoanController.updateLoan,
);

export default loanRouter;
