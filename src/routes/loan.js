import { Router } from 'express';
import AuthenticateUser from '../middleware/authenticateUser';
import ValidateLoan from '../middleware/validateLoan';
import LoanController from '../controllers/loanController';

const loanRouter = Router();

/* loanRouter.post(
  '/loans',
  AuthenticateUser.verifyUser,
  ValidateLoan.validateLoanApply,
  LoanController.createLoan,
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
/* loanRouter.get(
  '/loans/:id/repayments',
  AuthenticateUser.verifyUser,
  ValidateRepayment.validateRepaymentID,
  RepaymentController.getRepaymentHistory,
); */

loanRouter.patch(
  '/loans/:id',
  AuthenticateUser.verifyAdmin,
  ValidateLoan.validateLoanID,
  ValidateLoan.validatePatchOptions,
  LoanController.updateLoan,
);

export default loanRouter;
