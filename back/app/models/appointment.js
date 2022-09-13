const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Appointment extends Model {}

/**
 * @typedef {object} Appointment
 * @property {number} id - Indentifiant unique, Pk de la table
 * @property {string} title - Titre du rendez-vous
 * @property {string} note - Annotations pour commenter le rendez-vous
 * @property {timestamp with time zone} beginning_hour - Heure de début du rendez-vous
 * @property {timestamp with time zone} ending_hour - Heure de fin du rendez-vous
 * @property {number} pro_id - Id du pro auquel est rattaché le rendez-vous
 * @property {number} project_id - Id du projet auquel est rattaché le rendez-vous
 */

Appointment.init({
    title: DataTypes.TEXT,
    note: DataTypes.TEXT,
    beginning_hour: DataTypes.DATE,
    ending_hour: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'appointment',
});

module.exports = Appointment;
