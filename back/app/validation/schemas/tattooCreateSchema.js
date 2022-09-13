const Joi = require('joi');

module.exports = Joi.object({
    tattoo_picture_path: Joi.string()
        .required()
        .messages({
            'any.required': 'Le champ fichier est un champ obligatoire',
        }),
    pro_id: Joi.number().integer().min(1).required(),
});
