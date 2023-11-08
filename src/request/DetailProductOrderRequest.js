
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkDetailProductOrder = Joi.object({       
      product_order_code: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),  
      detail_product_order_name: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),  
      detail_product_order_quantity: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),  
      detail_product_order_unit: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),  
      detail_product_order_finish: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),  
      detail_product_order_packing: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),  
      detail_product_order_detail: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
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