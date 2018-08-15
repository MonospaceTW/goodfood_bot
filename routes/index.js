const express = require('express');
const router = express.Router();
const OauthController = require('../controller/oauth');

router.get('/oauth', OauthController.auth);

router.get('/spec', (req, res) => {
  console.log('\n\n\n\n!!!!!!!!!!!!!\n\n\n\n');
  return res.send({
    data: 'test',
  });
});

module.exports = router;
