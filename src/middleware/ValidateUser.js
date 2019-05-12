import debug from 'debug';
import HelperUtils from '../utils/HelperUtils';
import User from '../models/User';

const Debug = debug('dev_ENV');

/**
 * @class ValidateUser
 * @description Intercepts and validates a given request for user endpoints
 * @exports ValidateUser
 */
export default class ValidateUser {
  /**
   * @method validateProfileDetails
   * @description Validates profile details of the user upon registration
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateProfileDetails(req, res, next) {
    const validate = HelperUtils.validate();
    const {
      firstName, lastName, address, email, password,
    } = req.body;
    let error = '';

    if (!firstName || !validate.name.test(firstName)) {
      error = 'You need to include a valid first name';
    } else if (!lastName || !validate.name.test(lastName)) {
      error = 'You need to include a valid last name';
    } else if (!address) {
      error = 'You need to include a valid address';
    } else if (!email || !validate.email.test(email)) {
      error = 'You need to include a valid email address';
    } else if (!password) {
      error = 'You need to include a password';
    }

    if (error) {
      return res.status(400).json({ status: 400, error });
    }
    return next();
  }

  /**
   * @method validateLoginDetails
   * @description Validates login details (email and password)
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateLoginDetails(req, res, next) {
    const validate = HelperUtils.validate();
    const { email, password } = req.body;
    let error = '';
    let status;

    // Test validity of input
    if (!email || !validate.email.test(email)) {
      error = 'The email provided is invalid';
    } else if (!password) {
      error = 'Provide password to continue';
    }

    if (error) {
      status = 400;
      return res.status(status).json({ status, error });
    }

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
   * @method validateExistingUser
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateEmail(req, res, next) {
    const validate = HelperUtils.validate();
    const { email } = req.params;

    if (!email || !validate.email.test(email)) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid email type entered',
      });
    }
    return next();
  }
}
