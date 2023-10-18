
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkCategoriesSim = Joi.object({
        serial_sim: Joi.string().required().messages({
        'string.empty': `Số series Sim không được bỏ trống`,     
      }),
       board_lot_number: Joi.string().allow(null).allow('').messages({       
      }),     
      board_name: Joi.string().allow(null).allow('').messages({        
      }), 
      sim_status: Joi.string().allow(null).allow('').messages({      
      }), 
      activation_date: Joi.string().allow(null).allow('').messages({       
      }), 
      expiration_date: Joi.string().allow(null).allow('').messages({       
      }), 
      deadline_warning: Joi.string().allow(null).allow('').messages({       
      }),
      emanage_sim_note: Joi.string().allow(null).allow('').messages({       
      }), 
      sim_package_id: Joi.string().allow(null).allow('').messages({        
      }), 
      semi_product_id: Joi.string().allow(null).allow('').messages({       
      }), 
      sim_type: Joi.string().required().messages({
        'string.empty': ` Loại Sim không được bỏ trống`,
      }), 
    });
    const { error } = checkCategoriesSim.validate(req.body, { abortEarly: false });
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