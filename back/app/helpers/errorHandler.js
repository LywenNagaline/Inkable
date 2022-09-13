/**
 *
 * @param {object} err error class
 * @param {void} _ just need a 4th parameter to handle errors
 * @param {object} res Express response object
 * @param {_} next
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _, res, next) => {
    let { message } = err;
    const { infos } = err;
    const statusCode = infos?.statusCode || 500;
    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'Internal Server Error';
    }
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

module.exports = {
    errorHandler,
};
