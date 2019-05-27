import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const salt = +process.env.SALT;

/**
 * @class HelperUtils
 * @description
 * @exports HelperUtils
 */
class HelperUtils {
  /**
   * @method generateToken
   * @description
   * @returns token
   */
  static generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '2h' });
    return token;
  }

  /**
   * @method verifyToken
   * @description
   * @returns payload
   */
  static verifyToken(token) {
    try {
      const payload = jwt.verify(token, secretKey);
      return payload;
    } catch (error) {
      return false;
    }
  }

  /**
   * @method hashPassword
   * @description
   * @returns
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, salt);
  }

  /**
   * @method verifyPassword
   * @description
   * @returns
   */
  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

export default HelperUtils;
