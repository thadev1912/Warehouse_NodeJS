
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkQuantityControl = Joi.object({    
      quality_control_code: Joi.string().required().messages({
        'string.empty': `Mã QC kiểm tra không được bỏ trống`,
      }),
      jobsheet_code: Joi.string().required().messages({
        'string.empty': `Mã Jobsheet không được bỏ trống`,
      }),
      quality_control_create_date: Joi.string().required().messages({
        'string.empty': `Ngày tạo phiếu kiểm tra không được bỏ trống`,
      }),  
      user_id: Joi.string().required().messages({
        'string.empty': `Người tạo phiếu không được bỏ trống`,
      }),  
      quality_control_specification: Joi.string().allow(null).allow('').messages({
      
      }),  
      quality_control_note: Joi.string().allow(null).allow('').messages({
       
      }),  
      quality_control_status: Joi.string().allow(null).allow('').messages({
       
      }),    

    });
    const { error } = checkQuantityControl.validate(req.body, { abortEarly: false });
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