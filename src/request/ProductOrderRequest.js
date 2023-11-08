
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkProductOrder = Joi.object({       
      product_order_No: Joi.string().required().messages({  
        'string.empty': `Số Yêu Cầu Sản Xuất không được bỏ trống`,         
      }),  
      production_order_create: Joi.string().required().messages({  
        'string.empty': `Ngày tạo Yêu Cầu Sản Xuất không được bỏ trống`,         
      }),  
      production_order_invoice: Joi.string().required().messages({  
        'string.empty': `Số báo giá/đơn hàng không được bỏ trống`,         
      }),  
      user_create_by: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),
      
      production_order_note: Joi.string().allow(null).allow('').messages({  
                
      }),  
      production_order_status:Joi.string().allow(null).allow('').messages({  
             
      }),  
      production_order_receiver: Joi.string().required().messages({  
        'string.empty': `Số series Sim không được bỏ trống`,         
      }),    
    });
    const { error } = checkProductOrder.validate(req.body, { abortEarly: false });
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