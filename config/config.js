module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './db.development.sqlite',
    drop: true,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    drop: true,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    drop: false,
  },
};
