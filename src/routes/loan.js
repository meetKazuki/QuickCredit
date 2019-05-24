import { Router } from 'express';
import AuthenticateUser from '../middleware/authenticateUser';
import ValidateLoan from '../middleware/validateLoan';
import LoanController from '../controllers/loanController';
import ValidateRepayment from '../middleware/validateRepayment';
import RepaymentController from '../controllers/repaymentController';

const loanRouter = Router();

loanRouter.post(
  '/loans',
  AuthenticateUser.verifyUser,
  ValidateLoan.validateLoanApply,
  LoanController.createLoan,
);
loanRouter.post(
  '/loans/:id/repayment',
  ValidateRepayment.validateRepayID,
  ValidateRepayment.validateRepayBody,
  AuthenticateUser.verifyAdmin,
  ValidateRepayment.validateRepayCredentials,
  RepaymentController.postRepayment,
);

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
loanRouter.get(
  '/loans/:id/repayments',
  AuthenticateUser.verifyUser,
  ValidateRepayment.validateRepayID,
  RepaymentController.viewRepaymentHistory,
);

loanRouter.patch(
  '/loans/:id',
  AuthenticateUser.verifyAdmin,
  ValidateLoan.validateLoanID,
  ValidateLoan.validatePatchOptions,
  LoanController.updateLoan,
);

export default loanRouter;
