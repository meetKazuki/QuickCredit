import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import debug from 'debug';

const Debug = debug('dev_ENV');

dotenv.config();

const secretKey = process.env.SECRET_KEY;

class HelperUtils {
  static validate() {
    return {
      name: /^[a-zA-Z]+$/,
      email: /^([A-z0-9-_.]+)@([A-z0-9-_.]+)\.([A-z]{2,3})$/,
    };
  }

  static generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: '24 hours' });
    return token;
  }

  static verifyToken(token) {
    try {
      const payload = jwt.verify(token, secretKey);
      return payload;
    } catch (error) {
      return false;
    }
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

export default HelperUtils;
