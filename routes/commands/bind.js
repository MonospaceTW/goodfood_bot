const express = require('express');
const SqliteDb = require('../sqlite/sqlitedb');

const router = express.Router();
const db = new SqliteDb();

router.post('/', (req, res, next) => {
    const response = {};
    response.response_type = 'ephemeral';
    // check if send from slack
    const row = db.read('SELECT goodfood FROM Bind WHERE slack = ?', `${req.body.user_name}`);
    row.then((col) => {
        if (col.length === 0) {
            db.run('INSERT INTO Bind VALUES (?, ?)', `${req.body.user_name}`, `${req.body.text}`);
            response.text = `成功和 goodfood 帳號 ${req.body.text} 綁定，輸入 /unbind 可以取消綁定`;
        } else {
            response.text = `綁定失敗，您已經與 goodfood 帳號 ${col[0].goodfood} 做綁定，輸入 /unbind 可以取消綁定`;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
        res.end();
    });

    // db.close();
});

module.exports = router;
