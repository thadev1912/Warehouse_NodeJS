//Region validate:
const Joi = require("joi");
const checkRegion = Joi.object({
  region_id: Joi.string().required(),
  region_name: Joi.string().min(6).required(),
  region_note: Joi.string().required(),
});

module.exports = {
  checkRegion,
};