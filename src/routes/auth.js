import express from 'express';
import ValidateUser from '../middleware/validateUser';
import UserController from '../controllers/userController';

const router = express.Router();

router.post(
  '/signup',
  ValidateUser.validateProfileDetails,
  ValidateUser.validateExistingUser,
  UserController.createUser,
);

router.post(
  '/signin',
  ValidateUser.validateLoginDetails,
  UserController.authenticate,
);

export default router;
