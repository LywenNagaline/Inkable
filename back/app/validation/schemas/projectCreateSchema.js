const Joi = require('joi');

module.exports = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            'string.empty': 'Le titre est obligatoire',
            'any.required': 'Le titre est obligatoire',
        }),
    description: Joi.string()
        .required()
        .messages({
            'string.empty': 'La description du projet est obligatoire',
            'any.required': 'La description du projet est obligatoire',
        }),
    status: Joi.string(),
    color: Joi.boolean().required()
        .messages({
            'string.empty': 'Le projet est-il couleur ou noir et blanc?',
            'any.required': 'Le projet est-il couleur ou noir et blanc?',
        }),
    area: Joi.string()
        .required()
        .messages({
            'string.base': 'Le champ zone de tatouage doit être du texte.',
            'string.empty': 'La zone de tatouage doit être indiquée.',
            'any.required': 'La zone de tatouage doit être indiquée.',
        }),
    pro_id: Joi.number().integer().min(1).required(),
    consumer_id: Joi.number().integer().min(1).required(),
});
