const express = require('express');
const models = require('../models');

const router = express.Router();

// 建立使用者
router.post('/user/create', async (req, res) => {
  const newUser = await models.User.create({
    username: req.body.username,
  });

  return res.redirect('/users');
});

// 刪除使用者
router.get('/user/:user_id/destroy', (req, res) => {
  models.User.destroy({
    where: {
      id: req.params.user_id,
    },
  }).then(() => res.redirect('/users'));
});

module.exports = router;
