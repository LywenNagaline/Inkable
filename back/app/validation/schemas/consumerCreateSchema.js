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
            'string.email_check': 'L\'email est invalide',
        }),
    first_name: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'Le champ prénom doit être rempli',
            'any.required': 'Le champ prénom est un champ obligatoire',
        }),
    last_name: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'Le champ nom doit être rempli',
            'any.required': 'Le champ nom est un champ obligatoire',
        }),
    password: Joi
        .string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'Le mot de passe est obligatoire',
            'string.min': 'Le mot de passe doit comprendre 8 caractères',
            'any.required': 'Le mot de passe est obligatoire',
        }),
    passwordConfirm: Joi
        .string()
        .valid(Joi.ref('password'))
        .required()
        .error(() => new Error('Erreur liée à la confirmation du mot de passe')),
    profile_picture_path_consumer: Joi.string(),
    date_of_birth: Joi
        .string()
        .required()
        .messages({
            'string.empty': 'La date de naissance est obligatoire',
            'any.required': 'La date de naissance est obligatoire',
        }),
    role: Joi.string(),
});
