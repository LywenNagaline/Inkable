const Joi = require('joi');

module.exports = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    status: Joi.string(),
    color: Joi.boolean(),
    area: Joi.string(),
    pro_id: Joi.number().integer().min(1),
    consumer_id: Joi.number().integer().min(1),
});
