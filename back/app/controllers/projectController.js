/* eslint-disable object-shorthand */

const {
    Project,
    Pro,
    Consumer,
    Message,
    Notif,
} = require('../models');

module.exports = {

    /**
     * Project controller to get one project
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Selected project - Route API JSON response
     */

    async getOneProject(req, res) {
        // Récupérer l'id et le projet
        const { id } = req.params;
        const project = await Project.findByPk(id, {
            include: ['appointments', 'consumer', 'pro', 'notifs', {
                association: 'messages',
                include: ['pro', 'consumer'],
            }],
        });
        // Renvoyer une réponse
        if (project) {
            res.json(project);
        } else {
            throw new Error(`Aucun projet à l'id ${id}`, {
                statusCode: 404,
            });
        }
    },

    /**
     * Project controller to create one project
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Created project - Route API JSON response
     */

    async createProject(req, res) {
        req.body.status = 'en attente';
        const newProject = await Project.create(req.body);
        return res.json(newProject);
    },

    /**
     * Project controller to modify one project
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Modified project - Route API JSON response
     */

    async modifyProject(req, res) {
        // Récupérer l'id et le projet
        const { id } = req.params;
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error(`Aucun projet à l'id ${id}`, {
                statusCode: 404,
            });
        }
        console.log(req.body);
        let notif;
        let edit = false;
        // Modifier le projet avec les infos du body
        if (req.body.title) {
            project.title = req.body.title;
            edit = true;
        }
        if (req.body.description) {
            project.description = req.body.description;
            edit = true;
        }
        if (req.body.status) {
            project.status = req.body.status;
        }
        if (req.body.color !== undefined) {
            project.color = req.body.color;
            edit = true;
        }
        if (req.body.area) {
            project.area = req.body.area;
            edit = true;
        }

        if (req.body.status && req.body.status === 'accepté') {
            notif = await Notif.findOne({ where: { code: 'accepted_project' } });
            await project.addNotif(notif);
            await notif.addProject(project);
        } else if (req.body.status && req.body.status === 'refusé') {
            notif = await Notif.findOne({ where: { code: 'denied_project' } });
            await project.addNotif(notif);
            await notif.addProject(project);
        }
        // Sauvegarder et envoyer la réponse
        if (edit) {
            notif = await Notif.findOne({ where: { code: 'edit_project' } });
            await project.addNotif(notif);
            await notif.addProject(project);
        }
        await project.save();
        return res.json(project);
    },

    /**
     * Project controller to delete one project
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Sucess response - Route API JSON response
     */

    async deleteProject(req, res) {
        // Récupérer l'id et le projet
        const { id } = req.params;
        const project = await Project.findByPk(id);
        if (!project) {
            throw new Error(`Aucun projet à l'id ${id}`, {
                statusCode: 404,
            });
        }
        // Supprimer et envoyer la réponse
        await project.destroy();
        res.status(200).json('Projet supprimé');
    },

    /**
     * Project controller to get all projects from a pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns All projects of a pro - Route API JSON response
     */

    async getAllProjectsByPro(req, res) {
        // Récupérer les id du pro et des projets
        const { id } = req.params;
        const pro = await Pro.findByPk(id);
        if (!pro) {
            throw new Error(`Aucun pro à l'id ${id}`, {
                statusCode: 404,
            });
        }
        const projects = await Project.findAll({
            where: {
                pro_id: id,
            },
            include: 'consumer',

        });
        // Envoyer la réponse
        res.json(projects);
    },

    /**
     * Project controller to get all projects from a consumer
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns All projects of a consumer - Route API JSON response
     */

    async getAllProjectsByConsumer(req, res) {
        // Récupérer les id du consumer et des projets
        const { id } = req.params;
        const consumer = await Consumer.findByPk(id);
        if (!consumer) {
            throw new Error(`Aucun utilisateur à l'id ${id}`, {
                statusCode: 404,
            });
        }
        const projects = await Project.findAll({
            where: {
                consumer_id: id,
            },
        });
        // Envoyer la réponse
        res.json(projects);
    },

    /**
     * Project controller to create a message in a project
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns New message - Route API JSON response
     */
    //! modifié
    async createMessage(req, res) {
        const newMessage = await Message.create(req.body);
        const project = await Project.findByPk(req.body.project_id);

        if (req.body.pro_id) {
            const notif = await Notif.findOne({ where: { code: 'msg_pro' } });
            await project.addNotif(notif);
            await notif.addProject(project);
        } else if (req.body.consumer_id) {
            const notif = await Notif.findOne({ where: { code: 'msg_consumer' } });
            await project.addNotif(notif);
            await notif.addProject(project);
        }
        return res.json(newMessage);
    },
    //! à commenter
    async deleteNotifs(req, res) {
        const project = await Project.findByPk(req.params.id, { include: 'notifs' });
        project.notifs.forEach((notif) => {
            if (req.body.role === 'consumer') {
                if (notif.code !== 'msg_consumer') {
                    notif.removeProject(project);
                    project.removeNotif(notif);
                }
            } else if (req.body.role === 'pro') {
                if (notif.code === 'msg_consumer') {
                    notif.removeProject(project);
                    project.removeNotif(notif);
                }
            }
        });
        return res.json('Notifs supprimées');
    },
};
