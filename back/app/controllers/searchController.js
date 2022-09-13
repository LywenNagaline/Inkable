const {
    Style,
} = require('../models');
const client = require('../config/db');

module.exports = {

    // Ici on récupère les infos pour remplir les champs du formulaire de recherche de pro

    /**
     * Search controller to get all styles
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns All styles for the filter - Route API JSON response
     */

    async getAllStyles(req, res) {
        const styles = await Style.findAll();
        return res.json(styles);
    },

    /**
     * Search controller to get all cities
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns All the cities for the filter - Route API JSON response
     */

    async getAllCities(req, res) {
        const data = await client.query('SELECT DISTINCT city FROM pro');
        return res.json(data);
    },

};
