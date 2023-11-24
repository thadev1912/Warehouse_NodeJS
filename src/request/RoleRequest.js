
const Joi = require("joi");
const checkRole = Joi.object({ role_code: Joi.string() .required().messages({ 
    'string.empty': `Code Role không được bỏ trống`,   
      }),   
    role_name: Joi.string().required().messages({ 
        'string.empty': `Role Name không được bỏ trống`,
       
      }),
      description: Joi.string() .required().messages({ 
        'string.empty': `Miêu tả thông tin không được bỏ trống`,   
      }),
     });
 
module.exports ={
    checkRole,
};