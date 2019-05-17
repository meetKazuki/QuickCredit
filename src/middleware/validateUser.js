import HelperUtils from '../utils/helperUtils';
import User from '../models/User';

/**
 * @class ValidateUser
 * @description Intercepts and validates a given request for User endpoints
 * @exports ValidateUser
 */
export default class ValidateUser {
  /**
   * @method validateProfileDetails
   * @description Validates profile details of user upon registration
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateProfileDetails(req, res, next) {
    req
      .checkBody('firstName')
      .notEmpty()
      .withMessage('First name is required')
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage('First name should be between 3 to 15 charcters')
      .isAlpha()
      .withMessage('First name should only contain alphabets');

    req
      .checkBody('lastName')
      .notEmpty()
      .withMessage('Last name is required')
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage('Last name should be between 3 to 15 charcters')
      .isAlpha()
      .withMessage('Last name should only contain alphabets');

    req
      .checkBody('address')
      .notEmpty()
      .withMessage('Address field is required')
      .trim()
      .isLength({ min: 10, max: 50 })
      .withMessage('Address should be between 10 to 50 characters')
      // eslint-disable-next-line no-useless-escape
      .matches(/^[A-Za-z0-9\.\-\s\,]*$/)
      .withMessage('Invalid Address format entered');

    req
      .checkBody('email')
      .notEmpty()
      .withMessage('Email field is required')
      .trim()
      .isEmail()
      .withMessage('Invalid email address entered')
      .customSanitizer(email => email.toLowerCase());

    req
      .checkBody('password')
      .notEmpty()
      .withMessage('Password is required')
      .trim()
      .isLength({ min: 6, max: 15 })
      .withMessage('Password must be between 6 to 15 characters');
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, error: errors[0].msg });
    }
    return next();
  }

  /**
   * @method validateExistingUser
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateExistingUser(req, res, next) {
    const { email } = req.body;
    const user = User.findByEmail(email);

    if (!user) {
      return next();
    }

    return res.status(409).json({
      status: 409,
      error: 'User with provided email already exists',
    });
  }

  /**
   * @method validateLoginDetails
   * @description Validates login details (email and password)
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateLoginDetails(req, res, next) {
    let error = '';
    let status;

    req
      .checkBody('email')
      .notEmpty()
      .withMessage('Email field is required')
      .trim()
      .isEmail()
      .withMessage('Invalid email address entered')
      .customSanitizer(email => email.toLowerCase());

    req
      .checkBody('password')
      .notEmpty()
      .withMessage('Password field is required');
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ status: 400, error: errors[0].msg });
    }

    const { email, password } = req.body;

    // Find record with email
    const user = User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'The account provided does not exist',
      });
    }

    // verify password in the database
    const hashedPassword = user.password;
    const verifyPassword = HelperUtils.verifyPassword(`${password}`, hashedPassword);
    if (!verifyPassword) {
      error = 'Email/password is incorrect';
      status = 401;
    }
    if (error) {
      return res.status(status).json({ status, error });
    }

    // display user fields
    const userReq = user;
    req.user = {
      id: userReq.id,
      firstName: userReq.firstName,
      lastName: userReq.lastName,
      email: userReq.email,
      isAdmin: userReq.isAdmin,
    };
    return next();
  }

  /**
   * @method validateEmail
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateEmail(req, res, next) {
    req
      .checkParams('email')
      .notEmpty()
      .withMessage('Email field is required')
      .trim()
      .isEmail()
      .withMessage('Invalid Email Address Entered!')
      .customSanitizer(email => email.toLowerCase());
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        error: errors[0].msg,
      });
    }
    return next();
  }
}
