import express from 'express';
import ValidateUser from '../middleware/ValidateUser';
import AuthenticateUser from '../middleware/AuthenticateUser';
import UserController from '../controllers/UserController';

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
  AuthenticateUser.generateToken,
  UserController.createUser,
);
router.post(
  '/auth/signin',
  ValidateUser.validateLoginDetails,
  AuthenticateUser.generateToken,
  UserController.loginUser,
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

/**
 * PATCH / endpoints
 */
router.patch(
  '/users/:email/verify',
  AuthenticateUser.verifyToken,
  UserController.updateUser,
);

export default router;
