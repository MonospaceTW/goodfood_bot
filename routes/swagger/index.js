const express = require('express');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('../../docs/swagger.json');
const router = express.Router();

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    router.use(middleware.swaggerUi());
});

module.exports = router;