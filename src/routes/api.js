import express from 'express';
import validator from 'express-validator';

import ValidateUser from '../middleware/validateUser';
import AuthenticateUser from '../middleware/authenticateUser';
import UserController from '../controllers/userController';

import ValidateLoan from '../middleware/validateLoan';
import LoanController from '../controllers/loanController';

import ValidateRepayment from '../middleware/validateRepayment';
import RepaymentController from '../controllers/repaymentController';

const router = express.Router();
router.use(validator());

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to QuickCredit API v1' });
});

/**
 * /POST endpoints
 */
router.post(
  '/loans',
  AuthenticateUser.verifyUser,
  ValidateLoan.validateLoanApply,
  LoanController.createLoan,
);
router.post(
  '/loans/:id/repayment',
  ValidateRepayment.validateRepaymentID,
  AuthenticateUser.verifyAdmin,
  ValidateRepayment.validateRepayCredentials,
  RepaymentController.postLoanRepayment,
);

/**
 * /GET endpoints
 */
router.get(
  '/users',
  AuthenticateUser.verifyAdmin,
  UserController.getAllUsers,
);
router.get(
  '/users/:email',
  AuthenticateUser.verifyAdmin,
  UserController.getUser,
);
router.get(
  '/loans',
  ValidateLoan.validateQueryOptions,
  AuthenticateUser.verifyAdmin,
  LoanController.getAllLoans,
);
router.get(
  '/loans/:id',
  ValidateLoan.validateLoanID,
  AuthenticateUser.verifyAdmin,
  LoanController.getOneLoan,
);
router.get(
  '/loans/:id/repayments',
  AuthenticateUser.verifyUser,
  ValidateRepayment.validateRepaymentID,
  RepaymentController.getRepaymentHistory,
);

/**
 * /PATCH endpoints
 */
router.patch(
  '/users/:email/verify',
  ValidateUser.validateEmail,
  AuthenticateUser.verifyAdmin,
  UserController.updateUser,
);
router.patch(
  '/loans/:id',
  ValidateLoan.validateLoanID,
  AuthenticateUser.verifyAdmin,
  LoanController.updateLoan,
);

export default router;
