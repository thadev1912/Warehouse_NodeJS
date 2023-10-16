
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkProductGroup = Joi.object({
        product_group_code: Joi.string().required().messages({
        'string.empty': `Nhóm sản xuất không được bỏ trống`,       
      }),
      product_group_name: Joi.string().required().messages({
        'string.empty': `Tên Nhóm sản xuất không được bỏ trống`,
      }),
      product_group_note: Joi.string().allow(null).allow('').max(100).required().messages({     
        'string.max': `Nội dung ghi chú không được vượt quá 100 ký tự`,
      }),
    });
    const { error } = checkProductGroup.validate(req.body, { abortEarly: false });
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