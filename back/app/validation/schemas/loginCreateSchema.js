const Joi = require('joi');

module.exports = Joi.object({
    email: Joi
        .string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email est invalide',
            'string.empty': 'Le champ email doit être rempli',
            'any.required': 'Le champ email est un champ obligatoire',
        }),
    password: Joi.string().min(8)
        .required()
        .messages({
            'string.min': 'Le mot de passe fait 8 caractères minimum',
            'string.empty': 'Le champ mot de passe doit être rempli',
            'any.required': 'Le champ mot de passe est un champ obligatoire',
        }),

});
