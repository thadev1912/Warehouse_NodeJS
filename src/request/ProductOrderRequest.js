
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkCategoriesSim = Joi.object({       
      production_order_receiver: Joi.string().allow(null).allow('').messages({        
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