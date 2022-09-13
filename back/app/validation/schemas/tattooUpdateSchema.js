const Joi = require('joi');

module.exports = Joi.object({
    tattoo_picture_path: Joi.string(),
    pro_id: Joi.number().integer().min(1).required(),
});
