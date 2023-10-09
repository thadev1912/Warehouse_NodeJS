//Region validate:
const Joi = require("joi");
const checkRegion = Joi.object({ region_id: Joi.string() .required().messages({ 
    'string.empty': `Mã khu vực không được bỏ trống`,   
      }),   
    region_name: Joi.string() .min(6) .required().messages({ 
        'string.empty': `Tên khu vực không được bỏ trống`,   
      }),
      region_note: Joi.string().required().messages({ 
        'string.empty': `Ghi chú khu vực không được bỏ trống`,   
      }),
     });
 
module.exports ={
    checkRegion,
};