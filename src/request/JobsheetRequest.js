
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkJobsheet = Joi.object({
        jobsheet_code: Joi.string().required().messages({
        'string.empty': `Jobsheet code không được bỏ trống`,       
      }),     
      jobsheet_create_date: Joi.string().required().messages({
        'string.empty': `Ngày tạo jobsheet không được bỏ trống`,       
      }),    
      jobsheet_finish_date: Joi.string().required().messages({
        'string.empty': `Ngày hoàn thành jobsheet không được bỏ trống`,       
      }),  
      production_order_code: Joi.string().required().messages({
        'string.empty': `Lịch yêu cầu sản xuất không được bỏ trống`,       
      }), 
      user_id: Joi.string().required().messages({
        'string.empty': `Người dùng không được bỏ trống`,       
      }), 
      product_id: Joi.string().required().messages({
        'string.empty': `Mã sản xuất không được bỏ trống`,       
      }), 
      product_name: Joi.string().required().messages({
        'string.empty': `Tên sản xuất không được bỏ trống`,       
      }), 
      BOM_code: Joi.string().required().messages({
        'string.empty': `Mã BOM không được bỏ trống`,       
      }), 
      product_unit: Joi.string().required().messages({
        'string.empty': `Đơn vị sản xuất không được bỏ trống`,       
      }), 
      product_quantity: Joi.number().required().messages({
        'number.base': `Số lượng sản xuất không được bỏ trống`,       
      }), 
      product_type_code: Joi.string().required().messages({
        'string.empty': `Mã loại sản xuất không được bỏ trống`,       
      }), 
      product_series_code: Joi.string().required().messages({
        'string.empty': `Mã dòng sản xuất không được bỏ trống`,       
      }), 
      specification: Joi.string().required().messages({
        'string.empty': `Quy cách sản xuất không được bỏ trống`,       
      }),
      jobsheet_note: Joi.string().required().messages({
        'string.empty': ` Ghi chú sản xuất không được bỏ trống`,       
      }),
      jobsheet_note: Joi.string().allow(null).allow('').messages({             
      }),
      production_style: Joi.string().required().messages({   
        'string.empty': ` Loại sản xuất không được bỏ trống`,   
      }),
      jobsheet_status: Joi.string().allow(null).allow('').messages({              
      }),    
    });
    const { error } = checkJobsheet.validate(req.body, { abortEarly: false });
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