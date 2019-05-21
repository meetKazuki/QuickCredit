import HelperUtils from '../utils/helperUtils';
import DB from '../database/dbconnection';

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
      .checkBody('firstname')
      .notEmpty()
      .withMessage('First name is required')
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage('First name should be between 3 to 15 charcters')
      .isAlpha()
      .withMessage('First name should only contain alphabets');

    req
      .checkBody('lastname')
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
      res.status(400).json({ status: 400, error: errors[0].msg });
    }
    next();
  }

  /**
   * @method validateLoginDetails
   * @description Validates login details (email and password)
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static async validateLoginDetails(req, res, next) {
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
      res.status(400).json({ error: errors[0].msg });
    }

    const query = 'SELECT * from users WHERE email = $1';
    try {
      const { rows } = await DB.query(query, [req.body.email]);
      const hashedPassword = rows[0].password;
      const verifyPassword = HelperUtils.verifyPassword(`${req.body.password}`, hashedPassword);

      if (!rows[0]) {
        res.status(401).json({ error: 'Email/Password is incorrect' });
      }
      if (!verifyPassword) {
        res.status(401).json({ error: 'Email/Password is incorrect' });
      }

      const userReq = rows[0];
      req.user = userReq;
    } catch (error) {
      res.status(500).json({ error: 'Internal Server error' });
    }
    next();
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
      res.status(400).json({
        status: 400,
        error: errors[0].msg,
      });
    }
    next();
  }

  /**
   * @method validatePatchOptions
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validatePatchOptions(req, res, next) {
    req
      .checkBody('status')
      .notEmpty()
      .withMessage('Specify status field')
      .isAlpha()
      .withMessage('Invalid option specified')
      .equals('verified')
      .withMessage('Invalid status option entered');
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
    }
    next();
  }
}
