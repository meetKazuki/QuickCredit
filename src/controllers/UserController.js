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
    const { token } = req;
    const newUser = User.create(req.body);

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
      data: User.all(),
    });
  }

  /**
   * @method getUserByID
   * @description Gets a specific user by ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static getUserByID(req, res) {
    const userID = parseInt(req.params.id, 10);
    const user = User.find(userID);

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

  /* static getUserByEmail(req, res) {
    const userEmail = req.params.email;
    const user = User.findByEmail(userEmail);

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
  } */
}

export default UserController;
