import HelperUtils from '../utils/HelperUtils';

/**
 * @class ValidateUser
 * @description Intercepts and validates a given for user endpoints
 * @exports ValidateUser
 */
class ValidateUser {
  /**
   *
   * @method validateProfile
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
}

export default ValidateUser;
