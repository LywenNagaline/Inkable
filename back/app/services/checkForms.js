const bcrypt = require('bcrypt');
const ApiError = require('../errors/apiError');

module.exports = {

    /**
     * Fonction to hash users password in the db
     * @param {string} password
     * @returns an hashed password
     */

    async hashPassword(password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    },

    /**
     * Fonction to compare users password with the one in the db
     * @param {string} userPassword
     * @param {string} dbPassword
     * @returns a validation
     */

    async checkPassword(userPassword, dbPassword) {
        const isOk = await bcrypt.compare(userPassword, dbPassword);
        return isOk;
    },

    /**
     * Fonction to compare users password with the one in the db
     * @param {string} model
     * @param {string} userEmail
     * @returns an error if user already exist
     */

    async checkUnicity(model, userEmail) {
        const user = await model.findOne({
            where: {
                email: userEmail,
            },
        });
        if (user) return new ApiError('Utilisateur dejà existant sur le site', { statusCode: 500 });
        return false;
    },

    /**
     * Fonction to find a user
     * @param {string} model
     * @param {string} userEmail
     * @returns the user
     */

    async findUser(model, userEmail) {
        const user = await model.findOne({
            where: {
                email: userEmail,
            },
        });
        return user;
    },
};
