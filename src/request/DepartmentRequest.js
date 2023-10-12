
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkDepartment = Joi.object({
      department_code: Joi.string().required().messages({
        'string.empty': `Mã phòng ban không được bỏ trống`,
        'string.min': `Vui lòng nhập ít nhất 6 ký tự`,
      }),
      department_name: Joi.string().required().messages({
        'string.empty': `Tên phòng ban không được bỏ trống`,
      }),
      department_note: Joi.string().allow(null).allow('').max(100).required().messages({     
        'string.max': `Nội dung ghi chú không được vượt quá 100 ký tự`,
      }),
    });
    const { error } = checkDepartment.validate(req.body, { abortEarly: false });
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