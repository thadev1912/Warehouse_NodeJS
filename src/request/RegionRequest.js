
const Joi = require("joi");
const middlewareValidate = {
    checkValidate: (req, res, next) => {       
        const checkDepartment = Joi.object({ region_code: Joi.string().required().messages({ 
            'string.empty': `Mã khu vực không được bỏ trống`,            
           
          }),
            region_name: Joi.string().required().messages({ 
                'string.empty': `Tên khu vực không được bỏ trống`,   
              }),
            region_note: Joi.string().allow(null).allow('').messages({                  
                
              }) });
              const {error}=checkDepartment.validate(req.body,{abortEarly:false});              
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
