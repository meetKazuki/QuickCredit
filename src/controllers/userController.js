import HelperUtils from '../utils/helperUtils';
import DB from '../database/dbconnection';

/**
 * @class UserController
 * @description specifies which method handles a request for User endpoints
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
  static async createUser(req, res) {
    const {
      firstname, lastname, address, email, password,
    } = req.body;
    const hashedPassword = HelperUtils.hashPassword(password);
    const query = 'INSERT INTO users(firstname, lastname, address, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [firstname, lastname, address, email, hashedPassword];

    try {
      const { rows } = await DB.query(query, values);
      const { id, firstname, lastname, email, address, status, isadmin } = rows;
      const token = HelperUtils.generateToken({ id, email, isadmin });
      return res.status(201).json({
        message: 'Registration successful',
        data: {
          token,
          id: rows[0].id,
          firstname: rows[0].firstname,
          lastname: rows[0].lastname,
          address: rows[0].address,
          email: rows[0].email,
          isadmin: rows[0].isadmin,
          status: rows[0].status,
        },
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(409).send({ message: 'User with email already exist' });
      }
      return res.status(409).send(error);
    }
  }

  /**
   * @method authenticate
   * @description authenticates user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static authenticate(req, res) {
    const {
      id, firstname, lastname, email, isadmin, status,
    } = req.user;
    const token = HelperUtils.generateToken({
      id, email, isadmin, status,
    });

    res.status(200).json({
      message: 'Login successful!',
      data: {
        token,
        id,
        firstname,
        lastname,
        email,
        isadmin,
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
  /* static getAllUsers(req, res) {
    res.status(200).json({ status: 200, data: User.all() });
  } */

  /**
   * @method getUser
   * @description Gets a specific user by ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  /* static getUser(req, res) {
    const user = User.findByEmail(req.params.email);

    if (user) {
      res.status(200).json({
        status: 200,
        data: user,
      });
    } else {
      res.status(404).json({
        status: 404,
        error: 'User not found!',
      });
    }
  } */

  /**
   * @method verifyUser
   * @description Verifies a user by unique ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static updateUser(req, res) {
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
