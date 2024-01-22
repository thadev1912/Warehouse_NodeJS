
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    const checkManagerWMS = Joi.object({
      area_id: Joi.string().required().messages({
        'string.empty': `Mã tỉnh không được để trống!`,
      }),
      active_status: Joi.string().allow(null).allow('').messages({
        
      }),
      inactive_status: Joi.number().allow(null).allow('').messages({
      
      }),
      note: Joi.string().allow(null).allow('').messages({
      
      }),
    });
    const { error } = checkManagerWMS.validate(req.body, { abortEarly: false });
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