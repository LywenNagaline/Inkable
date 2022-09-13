const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Tattoo extends Model {}

/**
 * @typedef {object} Projet
 * @property {number} id - Indentifiant unique, Pk de la table
 * @property {string} tattoo_picture_path - URL du lien pour avoir l'image du tatouage
 * @property {number} pro_id - Id du pro auquel est rattaché le tatouage
 */

Tattoo.init({
    tattoo_picture_path: DataTypes.TEXT,
}, {
    sequelize,
    tableName: 'tattoo',
});

module.exports = Tattoo;
