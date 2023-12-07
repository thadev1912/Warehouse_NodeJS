
const Joi = require("joi");
const middlewareValidate = {
  checkValidate: (req, res, next) => {
    const checkManagerIMS = Joi.object({
      area_id: Joi.string().required().messages({
        'string.empty': `Mã tỉnh không được để trống!`,
      }),
      installed: Joi.string().allow(null).allow('').messages({
        
      }),
      next_phase: Joi.number().allow(null).allow('').messages({
      
      }),
      note: Joi.string().allow(null).allow('').messages({
      
      }),
    });
    const { error } = checkManagerIMS.validate(req.body, { abortEarly: false });
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