
const Joi = require("joi");
const middlewareValidate = {
    checkValidate: (req, res, next) => {
        // const token = req.headers.token; //cách lấy từ header
        const checkDepartment = Joi.object({ region_code: Joi.string().required().messages({ 
            'string.empty': `Mã khu vực không được bỏ trống`,            
           
          }),
            region_name: Joi.string().required().messages({ 
                'string.empty': `Tên khu vực không được bỏ trống`,   
              }),
            region_note: Joi.string() .max(100).required().messages({ 
                'string.empty': `Ghi chú khu vực không được bỏ trống`,   
                'string.max': `Ghi chú đã vượt tối quá 100 ký tự`,  
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
