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
                    const insert = db.prepare('INSERT INTO Bind VALUES (?, ?)');
                    insert.run(`${req.body.user_name}`, `${req.body.text}`);
                    insert.finalize();

                    db.all('SELECT * FROM Bind', (a, b) => {
                        console.log(b);
                    });

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        response_type: 'ephemeral',
                        text: `成功和 goodfood 帳號 ${req.body.text} 綁定，輸入 /unbind 可以取消綁定`,
                    }));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        response_type: 'ephemeral',
                        text: `綁定失敗，您已經與 goodfood 帳號 ${row[0].goodfood} 做綁定，輸入 /unbind 可以取消綁定`,
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
