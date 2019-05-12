export default class ValidateRepayment {
  static validateRepaymentID(req, res, next) {
    req
      .checkParams('id')
      .isNumeric()
      .withMessage('Invalid ID type specified');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 400,
        error: errors[0].msg,
      });
    }
    return next();
  }
}
