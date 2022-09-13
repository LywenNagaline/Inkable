const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Style extends Model {}

/**
 * @typedef {object} Style
 * @property {number} id - Indentifiant unique, Pk de la table
 * @property {string} name - Nom du style
 */

Style.init({
    name: DataTypes.TEXT,
}, {
    sequelize,
    tableName: 'style',
});

module.exports = Style;
