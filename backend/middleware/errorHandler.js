const { logEvents } = require('./logger');

const errorHandler = (error, req, res, next) => {
    logEvents(`${ error }: ${ error.message } -- Method: ${ req.method } -- URL: ${ req.url } -- Origin: ${ req.headers.origin }`, 'errorLog.log');

    console.log(error.stack);

    const status = res.statusCode ? res.statusCode : 500;

    res.status(status);

    res.json({ message: error.message });
};

module.exports = errorHandler;