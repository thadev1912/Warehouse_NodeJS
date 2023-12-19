
const Joi = require("joi");
const middlewareValidate = {
    checkValidate: (req, res, next) => {        
        const checkposition = Joi.object({ position_code: Joi.string().required().messages({ 
            'string.empty': `Mã phòng ban không được bỏ trống`,           
          }),           
            position_name: Joi.string() .required().messages({ 
                'string.empty': `Tên phòng ban không được bỏ trống`,   
              }),
              position_note: Joi.string().allow(null).allow('').messages({                  
               
              }),
             });
              const {error}=checkposition.validate(req.body,{abortEarly:false});              
              if(error)
              {        res.json({
                          status: 422,
                          error: error,
                          
                      });
                  
              }
              else
              {
                next();
              }
    }
}
module.exports = middlewareValidate