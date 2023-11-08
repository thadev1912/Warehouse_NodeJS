
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkAssemble = Joi.object({    
        jobsheet_code: Joi.string().required().messages({
        'string.empty': `Tên phòng ban không được bỏ trống`,
      }),
      assemble_create_date: Joi.string().required().messages({
        'string.empty': `Tên phòng ban không được bỏ trống`,
      }),
      assemble_status: Joi.string().required().messages({
        'string.empty': `Tên phòng ban không được bỏ trống`,
      }),    
    });
    const { error } = checkAssemble.validate(req.body, { abortEarly: false });
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