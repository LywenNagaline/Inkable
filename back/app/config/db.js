const { Sequelize } = require('sequelize');

const db = new Sequelize(
    process.env.PG_URL,
    {

        define: {
            underscored: true,
        },
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false, // This line will fix new error
            },
        },

    },
);

module.exports = db;
