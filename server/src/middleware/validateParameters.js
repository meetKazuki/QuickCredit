export default class validateParameter {
  /**
   * @method validateUUID
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateUUID(req, res, next) {
    req
      .checkParams('id')
      .isUUID()
      .withMessage('Invalid ID type specified');

    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
      return;
    }
    next();
  }

  /**
   * @method validateEmail
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateEmail(req, res, next) {
    req
      .checkParams('email')
      .notEmpty()
      .withMessage('Email field is required')
      .trim()
      .isEmail()
      .withMessage('Invalid email address specified')
      .customSanitizer(email => email.toLowerCase());
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
      return;
    }
    next();
  }

  /**
   * @method validateStatus
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validateStatus(req, res, next) {
    req
      .checkBody('status')
      .notEmpty()
      .withMessage('Specify status field')
      .isAlpha()
      .withMessage('Invalid status type specified')
      .equals('verified')
      .withMessage('Invalid status option specified');
    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
      return;
    }
    next();
  }

  /**
   * @method validatePatchOptions
   * @description
   * @param {object} req - The Request Object
   * @param {object} res - The Response Object
   * @returns
   */
  static validatePatchOptions(req, res, next) {
    req
      .checkBody('status')
      .trim()
      .isAlpha()
      .notEmpty()
      .withMessage('You failed to specify loan status in the request body')
      .matches(/^(approved|rejected)$/)
      .withMessage("Accepted values are 'approved' or 'rejected'");

    const errors = req.validationErrors();
    if (errors) {
      res.status(400).json({ status: 400, error: errors[0].msg });
      return;
    }
    next();
  }
}
