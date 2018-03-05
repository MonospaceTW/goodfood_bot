const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./bind.db');
const router = express.Router();

router.post('/', (req, res, next) => {
    if (req.body.token === 'S3Kizw5s0LYgspz80RutJFxH') {
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS Bind (slack TEXT, goodfood TEXT)');

            db.all(`SELECT goodfood FROM Bind WHERE slack = '${req.body.user_name}'`, (err, row) => {
                if (row.length === 0) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        response_type: 'ephemeral',
                        text: '此帳號尚未做綁定',
                    }));
                } else {
                    const nobind = db.prepare(`DELETE FROM bind WHERE slack = '${req.body.user_name}'`);
                    nobind.run();
                    nobind.finalize();
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        response_type: 'ephemeral',
                        text: '成功取消綁定',
                    }));
                }
            });
        });
        // db.close();
    } else {
        res.end();
    }
});

module.exports = router;
