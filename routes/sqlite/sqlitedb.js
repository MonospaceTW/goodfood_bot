const sqlite3 = require('sqlite3').verbose();

module.exports = class SqliteDb {
    constructor() {
        this.db = new sqlite3.Database('./routes/sqlite/bind.db');
        this.db.serialize(() => {
            this.db.run('CREATE TABLE IF NOT EXISTS Bind (slack TEXT, goodfood TEXT)');
        });
    }

    read(str) {
        return new Promise((reslove, reject) => {
            this.db.serialize(() => {
                this.db.all(str, (err, row) => {
                    reslove(row);
                });
            });
        });
    }

    run(str) {
        this.db.serialize(() => {
            const query = this.db.prepare(str);
            query.run();
            query.finalize();
        });
    }

    close() {
        this.db.close();
    }
};
