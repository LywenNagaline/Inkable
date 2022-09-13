const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Message extends Model {}

/**
 * @typedef {object} Message
 * @property {number} id - Indentifiant unique, Pk de la table
 * @property {string} content - Contenu du message
 * @property {number} project_id - Id du projet auquel est rattaché le message
 * @property {number} pro_id - Id du pro auquel est rattaché le message
 * @property {number} consumer_id - Id du particulier auquel est rattaché le message
 */

Message.init({
    content: DataTypes.TEXT,
}, {
    sequelize,
    tableName: 'message',
});

module.exports = Message;
