import HelperUtils from '../utils/HelperUtils';
import userDB from '../models/mock-users';

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

    /* const userID = userDB.findIndex(user => user.email === email);
    if (userID) {
      return res.status(409).json({
        status: 409,
        error: 'User with that email already exists',
      });
    } */

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

    const userID = userDB.findIndex(user => user.email === email);
    if (!email || !validate.email.test(email)) {
      error = 'Email provided is invalid';
    } else if (!password) {
      error = 'Provide password to continue';
    }

    if (error) {
      status = 400;
    } else if (userID === -1) {
      status = 404;
      error = 'Account does not exist';
    }

    if (status >= 400) {
      return res.status(status).json({ status, error });
    }
    return next();
  }
}

export default ValidateUser;
