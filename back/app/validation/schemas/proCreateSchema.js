const Joi = require('joi');

module.exports = Joi.object({
    studio_name: Joi.string()
        .required()
        .messages({
            'string.base': 'Le nom de studio doit être de type texte',
            'string.empty': 'Le nom de studio doit être rempli',
            'any.required': 'Le nom de studio est un champ obligatoire',
        }),
    password: Joi.string().min(8)
        .required()
        .messages({
            'string.empty': 'Le mot de passe est obligatoire',
            'string.min': 'Le mot de passe doit comprendre 8 caractères',
            'any.required': 'Le mot de passe est obligatoire',
        }),

    passwordConfirm: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .error(() => new Error('Erreur liée à la confirmation du mot de passe')),
    profile_picture_path_pro: Joi.string(),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'L\'email est invalide',
            'string.empty': 'Le champ email doit être rempli',
            'any.required': 'Le champ email est un champ obligatoire',
        }),
    styles: Joi.array(),
    description: Joi.string()
        .messages({
            'string.base': 'Le champ description est de type texte',
        }),
    instagram: Joi.string()
        .messages({
            'string.base': 'Le champ "instagram" est de type texte',
        }),
    color: Joi.boolean().required(),
    black_and_white: Joi
        .boolean()
        .required(),
    role: Joi.string(),
    city: Joi.string().required()
        .messages({
            'string.base': 'La ville doit être de type texte',
            'string.empty': 'La ville doit être remplie',
            'any.required': 'Le nom de ville est un champ obligatoire',
        }),
});
