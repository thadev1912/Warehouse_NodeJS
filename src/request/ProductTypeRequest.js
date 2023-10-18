
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkProductType = Joi.object({
        product_type_code: Joi.string().required().messages({
        'string.empty': `Loại sản xuất không được bỏ trống`,       
      }),
      product_type_name: Joi.string().required().messages({
        'string.empty': `Tên loại sản xuất không được bỏ trống`,
      }),
      product_type_note: Joi.string().allow(null).allow('').max(100).messages({     
        'string.max': `Nội dung ghi chú không được vượt quá 100 ký tự`,
      }),
    });
    const { error } = checkProductType.validate(req.body, { abortEarly: false });
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