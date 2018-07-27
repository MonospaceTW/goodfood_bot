const models = require('../models');
const express = require('express');

const router = express.Router();

// 首頁
router.get('/', async (req, res) => {
  const users = await models.User.findAll();

  return res.render('index', {
    title: 'Express Example',
    data: {
      users,
    },
  });
});

// 使用者清單
router.get('/users', async (req, res) => {
  const users = await models.User.findAll();

  return res.render('user', {
    title: 'User list',
    data: {
      users,
    },
  });
});

router.post('/test', async (req, res) => {
  console.log('req = %j', req.body);
  const cl = firebaseService.testConsole();
  const { user_name } = req.body;
  console.log(cl);
  const test = {
    text: `${user_name} test`
  };
  return res.json(test);
});

module.exports = router;
