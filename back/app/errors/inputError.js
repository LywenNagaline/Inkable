/**
 * @typedef {object} ApiError
 * @property {string} message - Error message
 * @property {string} name - Error name
 * @property {object} infos - Additionnal informations
 */

module.exports = class InputError extends Error {
    constructor(message, infos) {
        super(message);

        this.name = 'InputError';

        this.infos = infos;
    }
};
