//Region validate:
const Joi = require("joi");
const checkRole = Joi.object({ role_id: Joi.string() .required().messages({ 
    'string.empty': `Id Role không được bỏ trống`,   
      }),   
    role_name: Joi.string() .min(4) .required().messages({ 
        'string.empty': `Role Name không được bỏ trống`,
        'string.min':` Tên Role Name ít nhất 4 ký tự`,   
      }),
      user_id: Joi.string() .required().messages({ 
        'string.empty': `User id không được bỏ trống`,   
      }),
     });
 
module.exports ={
    checkRole,
};