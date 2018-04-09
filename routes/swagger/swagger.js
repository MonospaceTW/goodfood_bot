const express = require('express');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('../../config/swagger.json');

const router = express.Router();

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    router.use(middleware.swaggerUi());
});

module.exports = router;
