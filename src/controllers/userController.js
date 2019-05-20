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
   * @returns
   */
  static async createUser(req, res) {
    const {
      firstname, lastname, address, email, password,
    } = req.body;
    const hashedPassword = HelperUtils.hashPassword(password);
    const query = `INSERT INTO users(firstname, lastname, address, email, password) VALUES('${firstname}', '${lastname}', '${address}', '${email}', '${hashedPassword}') RETURNING *`;

    try {
      const { rows } = await DB.query(query);
      const {
        // eslint-disable-next-line no-shadow
        id, firstname, lastname, email, address, status, isadmin,
      } = rows;

      const token = HelperUtils.generateToken({ id, email, isadmin });
      return res.status(201).json({
        message: 'Registration successful',
        data: { token, ...rows[0] },
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(409).send({ message: 'User with email already exist' });
      }
      return res.status(500);
    }
  }

  /**
   * @method login
   * @description logs in user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
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
    const query = 'SELECT * FROM users';
    const { rows } = await DB.query(query);

    return res.status(200).json({ data: rows });
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
    const query = `SELECT * FROM users WHERE email='${email}'`;

    const findUser = await DB.query(query);
    if (!findUser.rowCount > 0) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    return res.status(200).json({ data: [findUser.rows[0]] });
  }

  /**
   * @method verifyUser
   * @description Verifies a user by unique ID
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} JSON API Response
   */
  static async verifyUser(req, res) {
    const { email } = req.params;
    const query = 'SELECT * FROM users WHERE email=$1';
    const update = "UPDATE users SET status='verified' WHERE email=$1 RETURNING *";

    const findUser = await DB.query(query, [email]);
    if (!findUser.rows.length) {
      return res.status(404).json({ error: 'Email does not exist' });
    }
    if (findUser.rows[0].status === 'verified') {
      return res.status(409).json({ error: 'User is already verified' });
    }

    const { rows } = await DB.query(update, [email]);
    return res.status(201).json({
      message: 'User successfully verified',
      data: { ...rows[0] },
    });
  }
}

export default UserController;
