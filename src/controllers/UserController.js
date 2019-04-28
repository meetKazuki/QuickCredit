import userDB from '../models/mock-users';

/**
 * @class UserController
 * @description specifies which method handles a request for a specific endpoint
 * @exports UserController
 */

class UserController {
  /**
   * @method createUser
   * @description Registers a user if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static createUser(req, res) {
    const {
      firstName, lastName, address, email, password,
    } = req.body;
    const { token } = req;
    const id = userDB.length + 1;
    const userData = {
      id,
      firstName,
      lastName,
      address,
      email,
      password,
      status: 'unverified',
    };

    userDB.concat(userData);
    res.status(201).json({
      status: 201,
      data: {
        token,
        id,
        firstName,
        lastName,
        email,
      },
    });
  }
}

export default UserController;
