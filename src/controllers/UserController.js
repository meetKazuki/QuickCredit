import HelperUtils from '../utils/HelperUtils';
import User from '../models/User';

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
    const newUser = User.create(req.body);
    const token = HelperUtils.generateToken({ newUser });

    res.status(201).json({
      status: 201,
      data: {
        message: 'Registration successful!',
        token,
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        address: newUser.address,
      },
    });
  }

  /**
   * @method authenticate
   * @description authenticates user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static authenticate(req, res) {
    const token = HelperUtils.generateToken(req.user);

    res.status(200).json({
      status: 200,
      data: {
        message: 'login successful!',
        token,
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
      },
    });
  }

  /**
   * @method getAllUsers
   * @description Lists all users in the database
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getAllUsers(req, res) {
    res.status(200).json({
      status: 200,
      data: User.all(),
    });
  }

  /**
   * @method getUser
   * @description Gets a specific user by ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getUser(req, res) {
    const user = User.findByEmail(req.params.email);

    if (user) {
      res.status(200).json({
        status: 200,
        data: user,
      });
    } else {
      res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }
  }

  /**
   * @method verifyUser
   * @description Verifies a user by unique ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static updateUser(req, res) {
    const user = User.findByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ status: 404, error: 'No user' });
    }

    const data = req.body;
    user.update(data);

    return res.status(201).json({
      status: 201,
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        address: user.address,
        status: user.status,
      },
    });
  }
}

export default UserController;
