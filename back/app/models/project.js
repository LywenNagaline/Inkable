const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Project extends Model {}

/**
 * @typedef {object} Projet
 * @property {number} id - Indentifiant unique, Pk de la table
 * @property {string} title - Titre du projet
 * @property {string} description - Annotations pour commenter le projet
 * @property {string} status - Statut pour savoir si le projet est accépté ou annulé par exemple
 * @property {boolean} color - Savoir si le projet sera en couleur ou noir et blanc
 * @property {string} area - Zone du tatouage
 * @property {number} pro_id - Id du pro auquel est rattaché le projet
 * @property {number} consumer_id - Id du particulier auquel est rattaché le projet
 */

Project.init({
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    status: DataTypes.TEXT,
    color: DataTypes.BOOLEAN,
    area: DataTypes.TEXT,

}, {
    sequelize,
    tableName: 'project',
});

module.exports = Project;
