
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkWelding = Joi.object({    
        jobsheet_code: Joi.string().required().messages({
        'string.empty': `Mã Jobsheet không được bỏ trống`,
      }),
      welding_create_date: Joi.string().required().messages({
        'string.empty': `Ngày tạo hàn mạch không được bỏ trống`,
      }),
      welding_status: Joi.string().required().messages({
        'string.empty': `Trạng thái hàn mạch không được bỏ trống`,
      }),    
    });
    const { error } = checkWelding.validate(req.body, { abortEarly: false });
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