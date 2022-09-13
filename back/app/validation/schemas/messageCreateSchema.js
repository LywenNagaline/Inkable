const Joi = require('joi');

module.exports = Joi.object({
    content: Joi.string()
        .required()
        .messages({
            'string.base': 'Le champ nouveau message doit être du texte.',
            'string.empty': 'Un message doit être renseigné.',
            'any.required': 'Un message doit être renseigné.',
        }),
    pro_id: Joi.number().integer().min(1),
    consumer_id: Joi.number().integer().min(1),
    project_id: Joi.number().integer().min(1).required(),
});
