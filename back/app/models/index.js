const Appointment = require('./appointment');

const Consumer = require('./consumer');
const Message = require('./message');
const Pro = require('./pro');
const Project = require('./project');
const Style = require('./style');
const Tattoo = require('./tattoo');
const Notif = require('./notif');

Message.belongsTo(Project, {
    as: 'project',
    foreignKey: 'project_id',
});

Project.hasMany(Message, {
    as: 'messages',
    foreignKey: 'project_id',
});

Message.belongsTo(Pro, {
    as: 'pro',
    foreignKey: 'pro_id',
});

Pro.hasMany(Message, {
    as: 'messages',
    foreignKey: 'pro_id',
});

Message.belongsTo(Consumer, {
    as: 'consumer',
    foreignKey: 'consumer_id',
});

Consumer.hasMany(Message, {
    as: 'messages',
    foreignKey: 'consumer_id',
});

Project.belongsTo(Consumer, {
    as: 'consumer',
    foreignKey: 'consumer_id',
});

Consumer.hasMany(Project, {
    as: 'projects',
    foreignKey: 'consumer_id',
});

Appointment.belongsTo(Project, {
    as: 'project',
    foreignKey: 'project_id',
});

Project.hasMany(Appointment, {
    as: 'appointments',
    foreignKey: 'project_id',
});

Project.belongsTo(Pro, {
    as: 'pro',
    foreignKey: 'pro_id',
});

Pro.hasMany(Project, {
    as: 'projects',
    foreignKey: 'pro_id',
});

Appointment.belongsTo(Pro, {
    as: 'pro',
    foreignKey: 'pro_id',
});

Pro.hasMany(Appointment, {
    as: 'appointments',
    foreignKey: 'pro_id',
});

Tattoo.belongsTo(Pro, {
    as: 'pro',
    foreignKey: 'pro_id',
});

Pro.hasMany(Tattoo, {
    as: 'tattoos',
    foreignKey: 'pro_id',
});

Style.belongsToMany(Pro, {
    as: 'pros',
    through: 'categorise',
    foreignKey: 'style_id',
    otherKey: 'pro_id',
    updatedAt: false,
});

Pro.belongsToMany(Style, {
    as: 'styles',
    through: 'categorise',
    foreignKey: 'pro_id',
    otherKey: 'style_id',
    updatedAt: false,
});

Project.belongsToMany(Notif, {
    as: 'notifs',
    through: 'project_has_notif',
    foreignKey: 'project_id',
    otherKey: 'notif_id',
    updatedAt: false,

});

Notif.belongsToMany(Project, {
    as: 'projects',
    through: 'project_has_notif',
    foreignKey: 'notif_id',
    otherKey: 'project_id',
    updatedAt: false,

});

module.exports = {
    Appointment,
    Consumer,
    Message,
    Pro,
    Project,
    Style,
    Tattoo,
    Notif,
};
