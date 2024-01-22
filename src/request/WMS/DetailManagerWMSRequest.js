
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    const checkDetailManagerWMS = Joi.object({
      name_station: Joi.string().required().messages({
        'string.empty': `Mã trạm không được để trống!`,
      }),
      serial_sim: Joi.string().allow(null).allow('').messages({       
      }),
      serial_station: Joi.string().required().messages({  
        'string.empty': `Sê ri trạm không được bỏ trống!`,
      }),
      installtion_date:Joi.string().required().messages({
        'string.empty': `Ngày lắp đặt không được bỏ trống!`,
      }),
      active_status: Joi.string().allow(null).allow('').messages({      
      }),
      address_of_station: Joi.string().required().messages({
        'string.empty': `Địa chỉ lắp đặt không được để trống!`,
      }),    
      version_board: Joi.string().required().messages({
        'string.empty': `Phiên bản board không được để trống!`,
      }),    
      standard:Joi.string().allow(null).allow('').messages({
        'string.empty': `Tiêu chuẩn không được để trống!`,
      }), 
      lot_board: Joi.string().required().messages({
        'string.empty': `Lot board không được để trống!`,
      }),     
      area_id: Joi.string().required().messages({      
      }),
      location: Joi.string().allow(null).allow('').messages({      
      }),
      location_area:Joi.string().required().messages({ 

      }),
      image: Joi.string().allow(null).allow('').messages({       
      }),
      note: Joi.string().allow(null).allow('').messages({          
      }),
     
     
     
    });
    const { error } = checkDetailManagerWMS.validate(req.body, { abortEarly: false });
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