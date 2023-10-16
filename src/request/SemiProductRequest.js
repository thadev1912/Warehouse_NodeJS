
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkSemiProduct = Joi.object({
      semi_product_lot: Joi.string().required().messages({
        'string.empty': `Lot bán thành phẩm không được bỏ trống`,       
      }),
      semi_product_code: Joi.string().required().messages({
        'string.empty': `Code bán thành phẩm không được bỏ trống`,
      }),
      semi_product_name: Joi.string().required().messages({     
        'string.empty': `Tên bán thành phẩm không được bỏ trống`,
      }),
      semi_product_assembler: Joi.string().allow(null).allow('').max(20).required().messages({     
        'string.max': `Tên Người lắp ráp bán thành phẩm không được vượt quá 20 ký tự`,
      }),
      semi_product_tester: Joi.string().allow(null).allow('').max(20).required().messages({     
        'string.max': `Tên người kiểm tra bán thành phẩm không được vượt quá 20 ký tự`,
      }),
      semi_product_assembly_date: Joi.string().required().messages({     
        'string.empty': `Ngày lắp ráp bán thành phẩm không được bỏ trống`,
      }),
      semi_product_test_date: Joi.string().required().messages({     
        'string.empty': `Ngày kiểm tra bán thành phẩm không được bỏ trống`,
      }),
      semi_product_status: Joi.string().required().messages({     
        'string.empty': `Trạng thái bán thành phẩm không được bỏ trống`,
      }),
      semi_product_result: Joi.string().required().messages({     
        'string.empty': `Kết quả bán thành phẩm không được bỏ trống`,
      }),
      semi_product_note: Joi.string().allow(null).allow('').max(100).required().messages({     
        'string.max': `Nội dung ghi chú không được vượt quá 100 ký tự`,
      }),
      jobsheet_code: Joi.string().required().messages({     
        'string.empty': `Mã jobsheet không được bỏ trống!!!`,
      }),
    });
    const { error } = checkSemiProduct.validate(req.body, { abortEarly: false });
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