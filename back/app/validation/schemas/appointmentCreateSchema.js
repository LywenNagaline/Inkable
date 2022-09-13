const Joi = require('joi');

module.exports = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            'string.base': 'Le titre du rdv doit être de type texte',
            'string.empty': 'Le titre du rdv doit être rempli',
            'any.required': 'Le titre du rdv est un champ obligatoire',
        }),
    note: Joi.string(),
    beginning_hour: Joi.date().required(),
    ending_hour: Joi.date().required(),
    pro_id: Joi.number().integer().min(1).required(),
    project_id: Joi.number().integer().min(1),
});
