/**
 * @typedef {object} ApiError
 * @property {string} message - Error message
 * @property {string} name - Error name
 * @property {object} infos - Additionnal informations
 */

module.exports = class ApiError extends Error {
    constructor(message, infos) {
        // On envoi le message à la classe mère Error
        super(message);
        // On défini le nom de l'erreur qui de base est 'Error'
        this.name = 'ApiError';
        // on défini les infos supplémentaires afin des les transporter
        this.infos = infos;
    }
};
