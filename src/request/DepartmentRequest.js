
const Joi = require("joi");
const checkDepartment = Joi.object({ department_id: Joi.string() .min(6) .required().messages({ 
    'string.empty': `Mã phòng ban không được bỏ trống`,   
    'string.min': `Vui lòng nhập ít nhất 6 ký tự`,
  }),
    department_code: Joi.string() .min(6) .required().messages({ 
        'string.empty': `Code phòng ban không được bỏ trống`,   
      }),
    department_name: Joi.string() .min(6) .required().messages({ 
        'string.empty': `Code phòng ban không được bỏ trống`,   
      }) });
 
module.exports ={
    checkDepartment,
}