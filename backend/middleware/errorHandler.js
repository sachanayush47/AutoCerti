const errorHandler = (err, req, res, next) => {
    console.log("ERROR " + Date.now());
    console.log(err);
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        err: err.message,
    });
};

export default errorHandler;
