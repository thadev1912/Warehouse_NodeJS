
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    const checkDetailManagerIMS = Joi.object({
      name_station: Joi.string().required().messages({
        'string.empty': `Mã tỉnh không được để trống!`,
      }),
      installtion_date: Joi.string().required().messages({
        'string.empty': `Ngày lắp đặt không được để trống!`,
      }),
      address_of_station: Joi.string().required().messages({
        'string.empty': `Địa chỉ lắp đặt không được để trống!`,
      }),
      customer: Joi.string().required().messages({
        'string.empty': `Khách hàng lắp đặt không được để trống!`,
      }),
      image: Joi.string().allow(null).allow('').messages({  
      
      }),
      location: Joi.string().required().messages({ 
        'string.empty': `Tọa độ lắp đặt không được để trống!`,  
      }),
      area_id: Joi.string().allow(null).allow('').messages({      
      }),
      active_status: Joi.string().allow(null).allow('').messages({      
      }),
      detail_installtion: Joi.string().allow(null).allow('').messages({      
      }),
    });
    const { error } = checkDetailManagerIMS.validate(req.body, { abortEarly: false });
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