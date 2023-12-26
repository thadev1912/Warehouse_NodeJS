
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {    
    const checkDetailProductOrder = Joi.object({       
      product_order_code: Joi.string().required().messages({  
        'string.empty': `Mã yêu cầu sản xuất không được bỏ trống`,         
      }),  
      detail_product_order_name: Joi.string().required().messages({  
        'string.empty': `Tên sản phẩm không được bỏ trống`,         
      }),  
      detail_product_order_quantity: Joi.number().required().messages({  
        'string.empty': `Số lượng yêu cầu không được bỏ trống`,         
      }),  
      detail_product_order_unit: Joi.string().required().messages({  
        'string.empty': `Đơn vị tính không được bỏ trống`,         
      }),  
      detail_product_order_finish: Joi.string().allow(null).allow('').messages({  
           
      }),  
      detail_product_order_packing: Joi.string().allow(null).allow('').messages({  
              
      }),  
      detail_product_order_detail: Joi.string().allow(null).allow('').messages({  
          
      }),       
      detail_product_order_purpose: Joi.string().allow(null).allow('').messages({ 
          
      }), 
      detail_product_order_type: Joi.string().allow(null).allow('').messages({  
          
      }), 
    });
    const { error } = checkDetailProductOrder.validate(req.body, { abortEarly: false });
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