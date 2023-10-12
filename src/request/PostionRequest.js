
const Joi = require("joi");
const middlewareValidate = {
    checkValidate: (req, res, next) => {
        // const token = req.headers.token; //cách lấy từ header
        const checkposition = Joi.object({ position_code: Joi.string().required().messages({ 
            'string.empty': `Mã phòng ban không được bỏ trống`,           
          }),           
            position_name: Joi.string() .required().messages({ 
                'string.empty': `Tên phòng ban không được bỏ trống`,   
              }),
              position_note: Joi.string().max(100).required().messages({ 
                'string.empty': `Ghi chú phòng ban không được bỏ trống`,   
                'string.max': `Nội dung ghi chú đã vượt quá 100 ký tự`, 
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