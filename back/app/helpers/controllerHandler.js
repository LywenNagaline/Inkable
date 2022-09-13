// Funtion factory permettant d'injecter le controller dans notre middleware d'impléméntation de
// try…catch…

/**
 * Controller Handler to manage errors
 * @param {object} controller a controller to execute inside a try... catch... block
 * @returns a controller as middleware function
 */
function controllerHandler(controller) {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

module.exports = controllerHandler;
