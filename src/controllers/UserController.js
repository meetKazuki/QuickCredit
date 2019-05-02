import User from '../models';

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
    const userID = req.params.email;
    const user = User.findByEmail(userID);

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
  static verifyUser(req, res) {
    const { user } = req;
    const userID = req.params.email;
    const userDetails = User.findByEmail(userID);

    if (!userDetails) {
      return res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }

    if (user.isAdmin === true) {
      const data = req.body;
      const attribute = data.status || 'verified';
      userDetails.changeStatus(attribute);

      return res.status(201).json({
        status: 201,
        data: {
          email: userDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          address: userDetails.address,
          password: userDetails.password,
          status: userDetails.status,
        },
      });
    }
    return res.status(403).json({
      status: 403,
      error: 'Forbidden',
    });
  }
}

export default UserController;
