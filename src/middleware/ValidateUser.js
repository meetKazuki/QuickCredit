import bcrypt from 'bcryptjs';
import HelperUtils from '../utils/HelperUtils';
import User from '../models';

/**
 * Determines if the user is valid
 * @param {User} user User object
 * @param {string} password provided password to validate against
 * @returns {boolean} returns truthy based on validation
 */
const isValidUser = (email, password) => {
  if (!email || !bcrypt.compareSync(password, email.password)) {
    return false;
  }
  return true;
};

/**
 * @class ValidateUser
 * @description Intercepts and validates a given for user endpoints
 * @exports ValidateUser
 */
class ValidateUser {
  /**
   * @method validateProfileDetails
   * @description Validates profile details of the user upon registration
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
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
   * @returns {object} JSON API Response
   */
  static validateLoginDetails(req, res, next) {
    const validate = HelperUtils.validate();
    const { email, password } = req.body;
    let error = '';
    let status;

    const user = User.findByEmail(email);
    if (!email || !validate.email.test(email)) {
      error = 'The email provided is invalid';
    } else if (!password) {
      error = 'Provide password to continue';
    }

    if (error) {
      status = 400;
    } else if (!isValidUser(user, password)) {
      status = 404;
      error = 'User does not exist';
    }

    if (status >= 400) {
      return res.status(status).json({ status, error });
    }

    return next();
  }
}

export default ValidateUser;
