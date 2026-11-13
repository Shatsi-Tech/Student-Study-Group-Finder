/**
 * Centralized Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: `API endpoint '${req.method} ${req.originalUrl}' was not found.`
    });
}

module.exports = {
    errorHandler,
    notFoundHandler
};
