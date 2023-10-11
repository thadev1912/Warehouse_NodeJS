
const Joi = require("joi");
const middlewareValidate = {
    checkValidate: (req, res, next) => {
        // const token = req.headers.token; //cách lấy từ header
        const checkposition = Joi.object({ position_id: Joi.string().required().messages({ 
            'string.empty': `Mã phòng ban không được bỏ trống`,           
          }),           
            position_name: Joi.string() .required().messages({ 
                'string.empty': `Code phòng ban không được bỏ trống`,   
              }) });
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