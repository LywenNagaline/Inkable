const { Consumer } = require('../models');
const authService = require('../services/checkForms');
// addConsumer est supprimé car géré par le authController (cf route /signupConsumer)

module.exports = {

    /**
     * Consumer controller to get one consumer
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns One consumer - Route API JSON response
     */

    async getOneConsumer(req, res) {
        // Récupérer l'id du consumer
        const { id } = req.params;
        // Trouver le consumer
        const consumer = await Consumer.findByPk(id, {
            include: {
                association: 'projects',
                include: ['appointments', 'pro', 'notifs'],
            },
        });
        // Envoyer le résultat si ok
        if (consumer) {
            res.json(consumer);
        } else {
            throw new Error(`Aucun consumer à l'id ${id}`, { statusCode: 404 });
        }
    },

    /**
     * Consumer controller to modify one consumer
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Modified consumer -  Route API JSON response
     */

    async modifyConsumer(req, res) {
        // Récupèrer l'id du consumer
        const { id } = req.params;
        // Trouver le consumer
        const consumer = await Consumer.findByPk(id);
        // Modifier le consummer
        if (consumer) {
            if (req.body.email) {
                consumer.email = req.body.email;
            }
            if (req.body.first_name) {
                consumer.first_name = req.body.first_name;
            }
            if (req.body.last_name) {
                consumer.last_name = req.body.last_name;
            }
            if (req.body.password) {
                consumer.password = await authService.hashPassword(req.body.password);
            }
            if (req.body.profile_picture_path_consumer) {
                consumer.profile_picture_path_consumer = req.body.profile_picture_path_consumer;
            }
            if (req.body.date_of_birth) {
                consumer.date_of_birth = req.body.date_of_birth;
            }
            // Sauvegarder en bdd
            const savedConsumer = await consumer.save();
            // Renvoyer le json
            res.json(savedConsumer);
        } else {
            throw new Error(`Aucun consumer à l'id ${id}`, { statusCode: 404 });
        }
    },

    /**
     * Consumer controller to delete one consumer
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Sucess Message -  Route API JSON response
     */

    async deleteConsumer(req, res) {
        // Récupérer l'id demandé
        const { id } = req.params;
        // Trouver le consumer
        const consumer = await Consumer.findByPk(id);
        // Supprimer si on trouve et envoyer la réponse
        if (consumer) {
            await consumer.destroy();
            res.json('Consumer supprimé');
        } else {
            throw new Error(`Aucun consumer à l'id ${id}`, { statusCode: 404 });
        }
    },
};
