import express from 'express';
import ValidateUser from '../middleware/ValidateUser';
import UserController from '../controllers/UserController';
import LoanController from '../controllers/LoanController';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to QuickCredit API v1' });
});

/**
 * POST /auth endpoints
 */
router.post(
  '/auth/signup',
  ValidateUser.validateProfileDetails,
  ValidateUser.validateExistingUser,
  UserController.createUser,
);
router.post(
  '/auth/signin',
  ValidateUser.validateLoginDetails,
  UserController.loginUser,
);
router.post(
  '/loans',
  LoanController.createLoan,
);

/**
 * GET / endpoints
 */
router.get(
  '/users',
  UserController.getAllUsers,
);
router.get(
  '/users/:email',
  UserController.getUser,
);
router.get(
  '/loans',
  LoanController.getAllLoans,
);
router.get(
  '/loans/:id',
  LoanController.getOneLoan,
);

/**
 * PATCH / endpoints
 */
router.patch(
  '/users/:email/verify',
  UserController.updateUser,
);
router.patch(
  '/loans/:id',
  LoanController.updateLoan,
);

export default router;
