import userDB from '../models/mock-users';
import User from '../models/index';

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
    const { token } = req;
    const userData = req.body;
    const newUser = new User(userData);

    userDB.push(newUser);
    res.status(201).json({
      status: 201,
      data: {
        token,
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        message: 'Registration successful!',
      },
    });
  }

  /**
   * @method loginUser
   * @description Logs in a user if details are valid
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static loginUser(req, res) {
    const { token } = req;

    res.status(200).json({
      status: 200,
      data: {
        token,
        email: req.body.email,
        message: 'login successful!',
      },
    });
  }

  /**
   * @method getUsers
   * @description Lists all users in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getUsers(req, res) {
    res.status(200).json({
      status: 200,
      data: [userDB],
    });
  }

  /**
   * @method getUser
   * @description Get a specific user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getUser(req, res) {
    const userID = parseInt(req.params.id, 10);
    const user = userDB.find(data => data.id === userID);

    if (user) {
      res.status(200).json({
        status: 200,
        data: [user],
      });
    } else {
      res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }
  }
}

export default UserController;
