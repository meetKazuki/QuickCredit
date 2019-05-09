import debug from 'debug';
import HelperUtils from '../utils/HelperUtils';

const Debug = debug('dev_ENV');

/**
 * @class AuthenticateUser
 * @description Authenticates a given user
 * @exports AuthenticateUser
 */
class AuthenticateUser {
  /**
   * @method
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static verifyAuthHeader(req) {
    if (!req.headers.authorization) {
      return { error: 'auth' };
    }
    const token = req.headers.authorization.split(' ')[1];
    const payload = HelperUtils.verifyToken(token);

    if (!payload) {
      return { error: 'token' };
    }
    return payload;
  }

  /**
   * @method verifyUser
   * @description Verifies the token provided by the user
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static verifyUser(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let status;

    if (payload && payload.error === 'auth') {
      status = 401;
      error = 'No authorization header was specified';
    } else if (payload && payload.error === 'token') {
      status = 401;
      error = 'The provided token cannot be authenticated.';
    }

    if (error) {
      return res.status(status).json({ status, error });
    }

    req.user = payload;
    return next();
  }

  /**
   * @method verifyAdmin
   * @description Verifies the token provided by the Admin
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static verifyAdmin(req, res, next) {
    const payload = AuthenticateUser.verifyAuthHeader(req);
    let error;
    let status;

    if (payload && payload.error === 'auth') {
      status = 401;
      error = 'No authorization header was specified';
      return res.status(status).json({ status, error });
    }

    if (payload && payload.error === 'token') {
      status = 401;
      error = 'Token provided cannot be authenticated.';
      return res.status(status).json({ status, error });
    }

    if (payload.isAdmin !== true) {
      return res.status(403).json({
        status: 403,
        error: 'Only admin can access this route',
      });
    }
    return next();
  }
}

export default AuthenticateUser;
