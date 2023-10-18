
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    // const token = req.headers.token; //cách lấy từ header
    const checkSimPackage = Joi.object({
      sim_package_expiration: Joi.number().required().messages({
        'number.base': `Thời hạn Sim không được bỏ trống`,       
      }),
      sim_package_description: Joi.string().required().messages({
        'string.empty': `Miêu tả Sim không được bỏ trống`,
      }),     
    });
    const { error } = checkSimPackage.validate(req.body, { abortEarly: false });
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