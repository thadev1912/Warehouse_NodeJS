
const Joi = require("joi");
const middlewareValidate = {
    checkValidate: (req, res, next) => {
        // const token = req.headers.token; //cách lấy từ header
        const checkDepartment = Joi.object({ region_id: Joi.string().required().messages({ 
            'string.empty': `Mã khu vực không được bỏ trống`,            
           
          }),
            region_name: Joi.string().required().messages({ 
                'string.empty': `Tên khu vực không được bỏ trống`,   
              }),
            region_note: Joi.string() .min(10).required().messages({ 
                'string.empty': `Ghi chú khu vực không được bỏ trống`,   
                'string.min': `Ghi chú phải ít nhất 10 ký tự`,  
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
//Region validate:
// const Joi = require("joi");
// const checkRegion = Joi.object({
//   region_id: Joi.string().required(),
//   region_name: Joi.string().min(6).required(),
//   region_note: Joi.string().required(),
// });

// module.exports = {
//   checkRegion,
// };