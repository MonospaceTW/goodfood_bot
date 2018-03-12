const sqlite3 = require('sqlite3').verbose();

module.exports = class SqliteDb {
    constructor() {
        this.db = new sqlite3.Database('./routes/sqlite/bind.db');
        this.db.serialize(() => {
            this.db.run('CREATE TABLE IF NOT EXISTS Bind (slack TEXT, goodfood TEXT)');
        });
    }

    read(str, ...values) {
        return new Promise((reslove, reject) => {
            this.db.serialize(() => {
                const select = this.db.prepare(str);
                select.all(...values, (err, row) => {
                    reslove(row);
                });
                select.finalize();
            });
        });
    }

    run(str, ...values) {
        this.db.serialize(() => {
            const query = this.db.prepare(str);
            query.run(...values);
            query.finalize();
        });
    }

    close() {
        this.db.close();
    }
};
