const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                status: "error",
                title: "Validation failed",
                message: err.message,
                // stackTrace: err.stack,
            });
            break;

        case constants.NOT_FOUND:
            res.json({
                status: "error",
                title: "Not found",
                message: err.message,
                // stackTrace: err.stack,
            });
            break;

        case constants.UNAUTHORIZED:
            res.json({
                status: "error",
                title: "Unauthorized",
                message: err.message,
                // stackTrace: err.stack,
            });
            break;

        case constants.FORBIDDEN:
            res.json({
                status: "error",
                title: "Forbidden",
                message: err.message,
                // stackTrace: err.stack,
            });
            break;

        case constants.SERVER_ERROR:
            res.json({
                status: "error",
                title: "Server Error",
                message: err.message,
                // stackTrace: err.stack,
            });
            break;

        default:
            res.json({
                status: "error",
                title: "Error",
                message: err.message,
                // stackTrace: err.stack,
            });
            break;
    }
};

module.exports = errorHandler;
