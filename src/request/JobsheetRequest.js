
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkJobsheet = Joi.object({
        jobsheet_code: Joi.string().required().messages({
        'string.empty': `Mã phòng ban không được bỏ trống`,
        'string.min': `Vui lòng nhập ít nhất 6 ký tự`,
      }),     
    });
    const { error } = checkJobsheet.validate(req.body, { abortEarly: false });
    if (error) {
      res.json({
        status: 422,
        error: error,

      });

    }
    else {
      next();
    }
  }
}
module.exports = middlewareValidate