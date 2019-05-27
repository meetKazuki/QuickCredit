import express from 'express';
import validator from 'express-validator';
import authRoute from './auth';
import userRoute from './users';
import loanRoute from './loan';

const router = express.Router();
router.use(validator());

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to QuickCredit API v1' });
});

router.use('/auth', authRoute);
router.use(userRoute);
router.use(loanRoute);

export default router;
