const Joi = require('joi');

module.exports = Joi.object({
    title: Joi.string(),
    note: Joi.string(),
    beginning_hour: Joi.date(),
    ending_hour: Joi.date(),
    pro_id: Joi.number().integer().min(1),
    project_id: Joi.number().integer().min(1).allow(null),
});
