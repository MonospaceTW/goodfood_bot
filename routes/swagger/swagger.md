## Add Swagger UI in to Project
1. 安裝 `swagger-ui` 和 `swagger-tools`
```
$ npm install swagger-ui
$ npm install swagger-tools
```
2. 在根目錄下建立 `swagger.json`（可參考[範例](http://petstore.swagger.io/v2/swagger.json)）
3. 在 `routes` 目錄下加入 `swagger.js`
```javascript
const express = require('express');
const swaggerTools = require('swagger-tools');
const swaggerDoc = require('../swagger.json');
const router = express.Router();

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
    router.use(middleware.swaggerUi());
});

module.exports = router;
```
4. 在 `app.js` 加入 swagger
```javascript
const swagger = require('./routes/swagger');

app.use(swagger);
```
5. 在 `http://yourdomain/docs` 開啟 swagger ui