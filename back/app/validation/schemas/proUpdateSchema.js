const Joi = require('joi');

module.exports = Joi.object({
    studio_name: Joi.string(),
    email: Joi.string().email(),
    password: Joi
        .string()
        .min(8)
        .messages({ 'string.min': 'Le mot de passe doit comprendre 8 caractères' }),
    passwordConfirm: Joi.string()
        .valid(Joi.ref('password'))
        .error(() => new Error('Erreur liée à la confirmation du mot de passe')),
    styles: Joi.array(),
    profile_picture_path_pro: Joi.string().allow(null),
    description: Joi.string().allow(null),
    instagram: Joi.string().allow(null),
    color: Joi.boolean(),
    black_and_white: Joi.boolean(),
    role: Joi.string(),
    city: Joi.string(),
});
