
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkProductSeries = Joi.object({
        product_series_code: Joi.string().required().messages({
        'string.empty': `Dòng sản xuất không được bỏ trống`,       
      }),
      product_series_name: Joi.string().required().messages({
        'string.empty': `Tên Dòng sản xuất không được bỏ trống`,
      }),
      product_series_note: Joi.string().allow(null).allow('').max(100).required().messages({     
        'string.max': `Nội dung ghi chú không được vượt quá 100 ký tự`,
      }),
    });
    const { error } = checkProductSeries.validate(req.body, { abortEarly: false });
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