import express from 'express';
import validator from 'express-validator';
import ValidateUser from '../middleware/validateUser';
import UserController from '../controllers/userController';

const router = express.Router();
router.use(validator());

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
