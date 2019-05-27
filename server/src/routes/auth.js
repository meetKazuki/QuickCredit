import { Router } from 'express';
import ValidateUser from '../middleware/validateUser';
import UserController from '../controllers/userController';

const authRoute = Router();

authRoute.post(
  '/signup',
  ValidateUser.validateProfileDetails,
  UserController.createUser,
);

authRoute.post(
  '/signin',
  ValidateUser.validateLoginDetails,
  UserController.login,
);

export default authRoute;
