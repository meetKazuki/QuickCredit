import { Router } from 'express';
import validateParameters from '../middleware/validateParameters';
import AuthenticateUser from '../middleware/authenticateUser';
import UserController from '../controllers/userController';
import LoanController from '../controllers/loanController';

const userRoute = Router();

userRoute.get(
  '/users',
  AuthenticateUser.verifyAdmin,
  UserController.getAllUsers,
);
userRoute.get(
  '/users/:email',
  validateParameters.validateEmail,
  AuthenticateUser.verifyAdmin,
  UserController.getUser,
);
userRoute.get(
  '/user/loans',
  AuthenticateUser.verifyUser,
  LoanController.viewUserLoans,
);

userRoute.patch(
  '/users/:email/verify',
  validateParameters.validateEmail,
  validateParameters.validateStatus,
  AuthenticateUser.verifyAdmin,
  UserController.verifyUser,
);

export default userRoute;
