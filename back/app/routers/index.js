const express = require('express');
const ApiError = require('../errors/apiError');
const {
    consumerController,
    proController,
    appointmentController,
    projectController,
    searchController,
    authController,
} = require('../controllers');
const { errorHandler } = require('../helpers/errorHandler');
const {
    projectCreateSchema,
    projectUpdateSchema,
    consumerCreateSchema,
    consumerUpdateSchema,
    tattooCreateSchema,
    proCreateSchema,
    proUpdateSchema,
    appointmentCreateSchema,
    appointmentUpdateSchema,
    loginCreateSchema,
    messageCreateSchema,

} = require('../validation/schemas');

const controllerHandler = require('../helpers/controllerHandler');
const validate = require('../validation/validator');

const router = express.Router();

const authenticateJWT = require('../middlewares/authenticateJWT');

// Routes de test
router.get('/api', (req, res) => {
    res.send('hello world');
});
router.get('/api/ping', (req, res) => {
    res.send('pong');
});
// ###############################################
// ########## Routes pour la partie Pro ##########
// ###############################################

/**
 * GET /api/pro
 * @summary Get all pros
 * @tags Pro
 * @return {[Pro]} 200 - success response - application/json
 */
router.get('/api/pro', controllerHandler(proController.getAllPro));

/**
 * POST /api/pro/search
 * @summary Get all filtred pros on the home page
 * @tags Pro
 * @return {[Pro]} 200 - success response - application/json
 */
router.post('/api/pro/search', controllerHandler(proController.CreateSearch));

router
    .route('/api/pro/:id')
    /**
     * GET /api/pro/{id}
     * @summary Get selected pro
     * @tags Pro
     * @param {number} id.path.required - pro identifier
     * @return {Pro} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Pro not found - application/json
     */
    .get(controllerHandler(proController.getOnePro))
    /**
     * PATCH /api/pro/{id}
     * @summary Modify selected pro
     * @tags Pro
     * @param {number} id.path.required - pro identifier
     * @param {InputPro} request.body.required - pro infos
     * @return {Pro} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Pro not found - application/json
     */
    .patch(validate('body', proUpdateSchema), controllerHandler(proController.modifyPro))
    /**
     * DELETE /api/pro/{id}
     * @summary Delete selected pro
     * @tags Pro
     * @param {number} id.path.required - pro identifier
     * @return {Pro} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Pro not found - application/json
     */
    .delete(controllerHandler(proController.deletePro));

router
    .route('/api/pro/:id/tatouages')
    /**
    * GET /api/pro/{id}/tatouages
    * @summary Get all tatoos from a pro
    * @tags Pro - Tatoo
    * @param {number} id.path.required - pro identifier
    * @return {[Tatoo]} 200 - success response - application/json
    * @return {ApiError} 400 - Bad request response - application/json
    * @return {ApiError} 404 - Pro not found - application/json
    */
    .get(controllerHandler(proController.getAllTattoosByPro))
    /**
    * POST /api/pro/{id}/tatouages
    * @summary Add a tatoo to one pro
    * @tags Pro - Tatoo
    * @param {number} id.path.required - pro identifier
    * @param {InputTatoo} request.body.required - tatoo infos
    * @return {Tatoo} 200 - success response - application/json
    * @return {ApiError} 400 - Bad request response - application/json
    * @return {ApiError} 404 - Pro not found - application/json
    */
    .post(validate('body', tattooCreateSchema), controllerHandler(proController.addTattoo));

/**
 * DELETE /api/pro/{id}/tatouages/{id}
 * @summary Delete one tatoo to one pro
 * @tags Pro - Tatoo
 * @param {number} id.path.required - pro identifier
 * @param {number} id.path.required - tatoo identifier
 * @return {Tatoo} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Pro not found - application/json
 * @return {ApiError} 404 - Tatoo not found - application/json
 */

router.delete('/api/pro/:idPro/tatouages/:idTattoo', controllerHandler(proController.deleteTattoo));

// ###############################################
// ########## Routes pour la partie RDV ##########
// ###############################################
router
    .route('/api/pro/:id/rdv')
    /**
    * GET /api/pro/{id}/rdv
    * @summary Get all appointments of one pro
    * @tags Pro - Appointment
    * @param {number} id.path.required - pro identifier
    * @return {[Appointment]} 200 - success response - application/json
    * @return {ApiError} 400 - Bad request response - application/json
    */
    .get(controllerHandler(appointmentController.getAllApointmentsByPro))
    /**
    * POST /api/pro/{id}/rdv
    * @summary Get all appointments of one pro and create some
    * @tags Pro - Appointment
    * @param {number} id.path.required - pro identifier
    * @param {InputAppointment} request.body.required - appointment infos
    * @return {[Appointment]} 200 - success response - application/json
    * @return {ApiError} 400 - Bad request response - application/json
    */
    .post(validate('body', appointmentCreateSchema), controllerHandler(appointmentController.addAppointement));

router
    .route('/api/pro/:idPro/rdv/:idRdv')
    /**
     * PATCH /api/pro/{id}/rdv/{id}
     * @summary Modify an appointment
     * @tags Pro - Appointment
     * @param {number} id.path.required - pro identifier
     * @param {number} id.path.required - appointment identifier
     * @param {InputAppointment} request.body.required - appointment infos
     * @return {Appointment} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Pro not found - application/json
     * @return {ApiError} 404 - Appointment not found - application/json
     */
    .patch(validate('body', appointmentUpdateSchema), controllerHandler(appointmentController.modifyAppointement))
    /**
     * DELETE /api/pro/{id}/rdv/{id}
     * @summary Delete an appointment
     * @tags Pro - Appointment
     * @param {number} id.path.required - pro identifier
     * @param {number} id.path.required - appointment identifier
     * @param {InputAppointment} request.body.required - appointment infos
     * @return {Appointment} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Pro not found - application/json
     * @return {ApiError} 404 - Appointment not found - application/json
     */
    .delete(controllerHandler(appointmentController.deleteAppointement));

// ####################################################
// ########## Routes pour la partie consumer ##########
// ####################################################

router
    .route('/api/consumer/:id')
    /**
     * GET /api/consumer/{id}
     * @summary Get a consumer
     * @tags Consumer
     * @param {number} id.path.required - consumer identifier
     * @return {Consumer} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Consumer not found - application/json
     */
    .get(controllerHandler(consumerController.getOneConsumer))
    /**
     * PATCH /api/consumer/{id}
     * @summary Modify a consumer
     * @tags Consumer
     * @param {number} id.path.required - consumer identifier
     * @param {InputConsumer} request.body.required - consumer infos
     * @return {Consumer} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Consumer not found - application/json
     */
    .patch(validate('body', consumerUpdateSchema), controllerHandler(consumerController.modifyConsumer))
    /**
     * DELETE /api/consumer/{id}
     * @summary Delete one consumer
     * @tags Consumer
     * @param {number} id.path.required - consumer identifier
     * @return {Consumer} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Consumer not found - application/json
     */
    .delete(controllerHandler(consumerController.deleteConsumer));

// ##################################################
// ########## Routes pour la partie projet ##########
// ##################################################

router
    .route('/api/projet/:id')
    /**
     * GET /api/project/{id}
     * @summary Get a project
     * @tags Project
     * @param {number} id.path.required - project identifier
     * @return {Project} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Project not found - application/json
     */
    .get(controllerHandler(projectController.getOneProject))
    /**
     * PATCH /api/project/{id}
     * @summary Modify a project
     * @tags Project
     * @param {number} id.path.required - project identifier
     * @param {InputProject} request.body.required - project infos
     * @return {Project} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Project not found - application/json
     */
    .patch(validate('body', projectUpdateSchema), controllerHandler(projectController.modifyProject))
    /**
     * DELETE /api/project/{id}
     * @summary Delete a project
     * @tags Project
     * @param {number} id.path.required - project identifier
     * @return {Project} 200 - success response - application/json
     * @return {ApiError} 400 - Bad request response - application/json
     * @return {ApiError} 404 - Project not found - application/json
     */
    .delete(controllerHandler(projectController.deleteProject));

/**
 * POST /api/project/
 * @summary Create a project
 * @tags Project
 * @param {InputProject} request.body.required - project infos
 * @return {Project} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */

router.post('/api/projet', validate('body', projectCreateSchema), controllerHandler(projectController.createProject));

/**
 * GET /api/pro/{id}/project
 * @summary Get all projects of a pro
 * @tags Project - Pro
 * @return {[Project]} 200 - success response - application/json
 */

router.get('/api/pro/:id/projet', controllerHandler(projectController.getAllProjectsByPro));

/**
 * GET /api/consumer/{id}/project
 * @summary Get all projects of a consumer
 * @tags Project - Consumer
 * @return {[Project]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Consumer not found - application/json
 */

router.get('/api/consumer/:id/projet', controllerHandler(projectController.getAllProjectsByConsumer));

/**
 * POST /api/message
 * @summary Create a message in a project
 * @tags Project
 * @param {InputMessage} request.body.required - message infos
 * @return {[Message]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Consumer not found - application/json
 */

router.post('/api/message', validate('body', messageCreateSchema), controllerHandler(projectController.createMessage));

//! à commenter(suppression notif)
router.post('/api/projet/:id/notifs', controllerHandler(projectController.deleteNotifs));

// ##################################################.
// ########## Routes pour la partie search ##########
// ##################################################

/**
 * GET /api/styles
 * @summary Get all styles for the filter
 * @tags Search
 * @return {[Styles]} 200 - success response - application/json
 */

router.route('/api/styles')
    .get(controllerHandler(searchController.getAllStyles));

/**
 * GET /api/cities
 * @summary Get all cities for the filter
 * @tags Search
 * @return {[Cities]} 200 - success response - application/json
 */

router.route('/api/cities')
    .get(controllerHandler(searchController.getAllCities));

// ###################################################
// ########## Route pour l'authentification ##########
// ###################################################

/**
 * POST /signupPro
 * @summary Allow to sign up as a pro
 * @tags Authentification
 * @param {InputPro} request.body.required - pro infos
 * @return {NewPro} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */

router.post('/signupPro', validate('body', proCreateSchema), controllerHandler(authController.signupPro));

/**
 * POST /signupConsumer
 * @summary Allow to sign up as a consummer
 * @tags Authentification
 * @param {InputConsumer} request.body.required - consumer infos
 * @return {NewConsumer} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */

router.post('/signupConsumer', validate('body', consumerCreateSchema), controllerHandler(authController.signupConsumer));

/**
 * POST /login
 * @summary Allow to login as pro or consumer
 * @tags Authentification
 * @param {InputVisitor} request.body.required - visitor infos
 * @return {AcessToken} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */

router.post('/login', validate('body', loginCreateSchema), controllerHandler(authController.login));

// #######################################
// ########## route de test JWT ##########
// #######################################

// router.get('/testConsumer', authenticateJWT, authController.testConsumer);
// route de test JWT
// router.get('/testPro', authenticateJWT, authController.testPro);

/**
 * GET /checkRole
 * @summary
 * @tags Authentification
 * @return {AcessToken} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */

router.get('/checkRole', authenticateJWT, authController.verifyToken);

router.use(() => {
    throw new ApiError('API Route not found', { statusCode: 404 });
});
router.use(errorHandler);
module.exports = router;
