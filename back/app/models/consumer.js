const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Consumer extends Model {}

/**
 * @typedef {object} Consumer
 * @property {number} id - Indentifiant unique, Pk de la table
 * @property {string} email - Email du particulier
 * @property {string} first_name - Prénom du particulier
 * @property {string} last_name - Nom du particulier
 * @property {string} password - Mot de passe du particulier
 * @property {string} profile_picture_path_consumer - URL pour accéder à la photo de profil
 * @property {string} date_of_birth - Date de naissance pour vérifie que la personne soit majeure
 * @property {string} role - Attribut qui va définir le fait qu'il soit particulier
 */

Consumer.init({
    email: DataTypes.TEXT,
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    password: DataTypes.TEXT,
    profile_picture_path_consumer: DataTypes.TEXT,
    date_of_birth: DataTypes.TEXT,
    role: DataTypes.TEXT,
}, {
    sequelize,
    tableName: 'consumer',
});

module.exports = Consumer;
