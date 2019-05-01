import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.SECRET_KEY;

/**
 * @class AuthenticateUser
 * @description Intercepts and validates a given request for user endpoints
 * @exports AuthenticateUser
 */
class AuthenticateUser {
  /**
   * @method generateToken
   * @description Generates JWT upon user registration or login
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {string} - The token string
   */
  static generateToken(req, res, next) {
    jwt.sign(req.body, secretKey, { expiresIn: '5 minutes' }, (err, token) => {
      req.token = `Bearer ${token}`;
      return next();
    });
  }

  /**
   * @method verifyToken
   * @description Verifies token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns {object} - JSON response object
   */
  static verifyToken(req, res, next) {
    const bearer = req.headers.authorization;
    if (!bearer) {
      return res.status(403).json({
        status: 403,
        error: 'Unauthorized. Provide token to make request.',
      });
    }

    const token = bearer.split(' ')[1];
    return jwt.verify(token, secretKey, (err) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Token provided cannot be authenticated.',
        });
      }
      return next();
    });
  }
}

export default AuthenticateUser;
