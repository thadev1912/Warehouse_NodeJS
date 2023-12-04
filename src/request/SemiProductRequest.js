
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {    
    const checkSemiProduct = Joi.object({
      semi_product_lot: Joi.string().required().messages({
        'string.empty': `Lot bán thành phẩm không được bỏ trống`,       
      }),
      semi_product_code: Joi.string().required().messages({
        'string.empty': `Code bán thành phẩm không được bỏ trống`,
      }),
      semi_product_name: Joi.string().required().messages({     
        'string.empty': `Tên bán thành phẩm không được bỏ trống`,
      }),
      semi_product_assembler: Joi.string().allow(null).allow('').messages({     
       
      }),
      semi_product_tester: Joi.string().allow(null).allow('').messages({     
        
      }),
      semi_product_assembly_date: Joi.string().allow(null).allow('').messages({     
       
      }),
      semi_product_test_date: Joi.string().allow(null).allow('').messages({     
       
      }),
      semi_product_status: Joi.string().allow(null).allow('').messages({     
       
      }),
      semi_product_result: Joi.string().allow(null).allow('').messages({     
       
      }),
      semi_product_note: Joi.string().allow(null).allow('').messages({     
       
      }),
      jobsheet_code: Joi.string().allow(null).allow('').messages({     
       
      }),
      categories_sim_id: Joi.string().allow(null).allow('').messages({   
             
      }),
      //---
      semi_product_unit: Joi.string().allow(null).allow('').messages({   
        
      }),
      activation_date: Joi.string().allow(null).allow('').messages({   
        
      }),
      sim_package_id: Joi.string().allow(null).allow('').messages({   
        
      }),
      purpose: Joi.string().allow(null).allow('').messages({   
        
      }),
      expiration_date: Joi.string().allow(null).allow('').messages({  
        
      }),
      old_semi_product_id: Joi.string().allow(null).allow('').messages({  
        
      }),
      old_sim_id: Joi.string().allow(null).allow('').messages({  
        
      }),

    });
    const { error } = checkSemiProduct.validate(req.body, { abortEarly: false });
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