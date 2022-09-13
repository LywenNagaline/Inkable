/* eslint-disable object-shorthand */
const {
    Pro, Tattoo, Style,
} = require('../models');
const authService = require('../services/checkForms');
const client = require('../config/db');
// suppression addPro car géré dans AuthController (cf route /signupPro)

module.exports = {

    /**
     * Pro controller to get all pros
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns All pros - Route API JSON response
     */

    async getAllPro(req, res) {
        // Récupérer les pros
        const pros = await Pro.findAll({
            include: ['styles', 'tattoos', 'appointments', 'projects'],
        });
        // Renvoyer la réponse
        return res.json(pros);
    },

    /**
     * Pro controller to filter pros with a form
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Filtred pros - Route API JSON response
     */

    async CreateSearch(req, res) {
        // Rquête sql pour avoir tous les pros
        let query = `SELECT DISTINCT pro.* FROM pro
        LEFT OUTER JOIN categorise ON pro_id=pro.id
        LEFT OUTER JOIN style on categorise.style_id=style.id
        WHERE `;
        // Ici on va stocker les données rentrées dans le formulaire pour la requête SQL
        let conditions = [];
        // Et ici les infos avec lesquelles nous allons intéroger la BDD
        const args = [];
        let count = 1;

        // Si un champs est défini, pusher la condition dans le tableau
        if (req.body.city !== undefined) {
            conditions.push(`city = $${count}`);
            args.push(req.body.city);
            count += 1;
        }
        if (req.body.color !== undefined) {
            conditions.push(`color = $${count}`);
            args.push(req.body.color);
            count += 1;
        }
        if (req.body.black_and_white !== undefined) {
            conditions.push(`black_and_white = $${count}`);
            args.push(req.body.black_and_white);
            count += 1;
        }
        if (req.body.style !== undefined) {
            conditions.push(`style.name= $${count}`);
            args.push(req.body.style);
        }
        // Ajouter toutes conditions du tableau sur la requête pour la filter
        conditions = conditions.join(' AND ');
        query += conditions;
        const filteredPros = await client.query(query, {
            bind: args,
        });
        res.json(filteredPros[0]);
    },

    /**
     * Pro controller to get one pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns One pro - Route API JSON response
     */

    async getOnePro(req, res) {
        // Récupérer l'id et le pro
        const { id } = req.params;
        // const project = await Project.findByPk(id, {
        //     include: ['appointments', 'consumer', 'pro', {
        //         association: 'messages',
        //         include: ['pro', 'consumer'],
        //     }],
        // });
        const findOnePro = await Pro.findByPk(id, {
            include: ['styles', 'tattoos', 'appointments', {
                association: 'projects',
                include: ['notifs', 'consumer'],
            }],
        });
        // Renvoyer la réponse si on trouve
        if (findOnePro) {
            res.json(findOnePro);
        } else {
            throw new Error(`Aucun pro à l'id ${id}`, { statusCode: 404 });
        }
    },

    /**
     * Pro controller to modify one pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Modified pro - Route API JSON response
     */

    async modifyPro(req, res) {
        // Récupérer l'id et le pro
        const { id } = req.params;
        const pro = await Pro.findByPk(id);
        // Modifier le pro avec les infos du body
        if (pro) {
            if (req.body.studio_name) {
                pro.studio_name = req.body.studio_name;
            }
            if (req.body.email) {
                const error = await authService.checkUnicity(Pro, req.body.email);
                if (error) throw error;
                else pro.email = req.body.email;
            }
            if (req.body.password) {
                pro.password = await authService.hashPassword(req.body.password);
            }
            if (req.body.profile_picture_path_pro) {
                pro.profile_picture_path_pro = req.body.profile_picture_path_pro;
            }
            if (req.body.description) {
                pro.description = req.body.description;
            }
            if (req.body.instagram) {
                pro.instagram = req.body.instagram;
            }
            if (req.body.color !== undefined) {
                pro.color = req.body.color;
            }
            if (req.body.black_and_white !== undefined) {
                pro.black_and_white = req.body.black_and_white;
            }

            if (req.body.city) {
                pro.city = req.body.city.toUpperCase();
            }

            if (req.body.styles) {
                const styles = await Style.findAll();
                styles.forEach(async (style) => {
                    await pro.removeStyle(style);
                    await style.removePro(pro);
                });
                req.body.styles.forEach(async (style) => {
                    const oneStyle = await Style.findOne({ where: { name: style } });
                    await pro.addStyle(oneStyle);
                });
            }
            // Sauvegarder dans la BDD et renvoyer le JSON
            const proSaved = await pro.save();
            res.json(proSaved);
        } else {
            throw new Error(`Aucun pro à l'id ${id}`, { statusCode: 404 });
        }
    },

    /**
     * Pro controller to delete one pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Sucess response - Route API JSON response
     */

    async deletePro(req, res) {
        // Récupérer l'id et le pro
        const { id } = req.params;
        const pro = await Pro.findByPk(id);
        // Supprimer le pro si trouvé et renvoyer une réponse
        if (pro) {
            await pro.destroy();
            res.json('Pro supprimé');
        } else {
            throw new Error(`Aucun pro à l'id ${id}`, { statusCode: 404 });
        }
    },

    /**
     * Pro controller to get all tatoos from a pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns All tatoos of a pro - Route API JSON response
     */

    async getAllTattoosByPro(req, res) {
        // Récupérer le pro
        const { id } = req.params;
        const pro = await Pro.findByPk(id);
        if (!pro) { throw new Error(`Aucun pro à l'id ${id}`, { statusCode: 404 }); }

        // Récupérer les tatoos
        const tattoos = await Tattoo.findAll({
            where: {
                pro_id: id,
            },
        });
        // Renvoyer la réponse
        res.json(tattoos);
    },

    /**
     * Pro controller to add a tatoo to one pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Added tatoo - Route API JSON response
     */

    async addTattoo(req, res) {
        // Récupérer le pro
        const { id } = req.params;
        const findOnePro = await Pro.findByPk(id);
        if (findOnePro) {
            // Créer le nouveau tatoo
            const newTattoo = await Tattoo.create({
                tattoo_picture_path: req.body.tattoo_picture_path,
                pro_id: id,
            });
            // Envoyer la réponse
            res.json(newTattoo);
        } else {
            throw new Error(`Aucun pro à l'id ${id}`, { statusCode: 404 });
        }
    },

    /**
     * Pro controller to delete a tatoo to one pro
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @returns Sucess response - Route API JSON response
     */

    async deleteTattoo(req, res) {
        // Récupérer le pro et le tatoo
        const { idPro, idTattoo } = req.params;
        const pro = await Pro.findByPk(idPro);
        if (!pro) throw new Error(`Aucun pro à l'id ${idPro}`, { statusCode: 404 });
        const tattoo = await Tattoo.findByPk(idTattoo);
        // Supprimer le tatoo et renvoyer la réponse
        if (tattoo) {
            await tattoo.destroy();
            res.json('Tatouage supprimé');
        } else {
            throw new Error(`Aucun tattoo à l'id ${idTattoo}`, { statusCode: 404 });
        }
    },

};
