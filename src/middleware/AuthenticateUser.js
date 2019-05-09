import debug from 'debug';
import HelperUtils from '../utils/HelperUtils';

const Debug = debug('QuickCredit');

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

    Debug('verifyUser:payload', payload);

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
    Debug(payload);
    const { isAdmin } = payload;

    if (isAdmin === false) {
      return res.status(401).json({
        status: 401,
        error: 'You are not authorized to access this endpoint.',
      });
    }

    return next();
  }
}

export default AuthenticateUser;
