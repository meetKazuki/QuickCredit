import uuidv4 from 'uuid/v4';
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
   * @returns {void}
   */
  static async createUser(req, res) {
    const {
      firstname, lastname, address, email, password,
    } = req.body;
    const hashedPassword = HelperUtils.hashPassword(password);
    const query = `INSERT INTO
      users(id, firstname, lastname, address, email, password)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id, firstname, lastname, address, email, status, isadmin`;
    const values = [uuidv4(), firstname, lastname, address, email, hashedPassword];

    try {
      const { rows } = await DB.query(query, values);
      const {
        // eslint-disable-next-line no-shadow
        id, firstname, lastname, email, address, status, isadmin,
      } = rows;

      const token = HelperUtils.generateToken({ id, email, isadmin });
      res.status(201).json({
        message: 'Registration successful',
        data: { token, ...rows[0] },
      });
      return;
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        res.status(409).json({ message: 'User with email already exist' });
        return;
      }
      res.status(500).json({ error });
    }
  }

  /**
   * @method login
   * @description logs in user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {void}
   */
  static login(req, res) {
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
  static async getAllUsers(req, res) {
    const query = 'SELECT id, firstname, lastname, address, email, status, isadmin FROM users';
    const { rows } = await DB.query(query);

    res.status(200).json({ data: rows });
  }

  /**
   * @method getUser
   * @description Gets a specific user by ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async getUser(req, res) {
    const { email } = req.params;
    const query = `SELECT id, firstname, lastname, address, email, status, isadmin FROM users WHERE email='${email}'`;

    const findUser = await DB.query(query);
    if (!findUser.rowCount > 0) {
      res.status(404).json({ error: 'User does not exist' });
      return;
    }

    res.status(200).json({ data: [findUser.rows[0]] });
  }

  /**
   * @method verifyUser
   * @description Verifies a user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async verifyUser(req, res) {
    const { email } = req.params;
    const query = `SELECT * FROM users WHERE email='${email}'`;
    const update = `UPDATE users SET status='verified' WHERE email='${email}' RETURNING firstname, lastname, address, status, isadmin`;

    const findUser = await DB.query(query);
    if (!findUser.rows.length) {
      res.status(404).json({ error: 'Email does not exist' });
      return;
    }
    if (findUser.rows[0].status === 'verified') {
      res.status(409).json({ error: 'User is already verified' });
      return;
    }

    const { rows } = await DB.query(update);
    res.status(201).json({
      message: 'User successfully verified',
      data: { ...rows[0] },
    });
  }
}

export default UserController;
