const levelup = require('levelup');
const leveldown = require('leveldown');

const leveldb = levelup(leveldown('./leveldb'), {
    valueEncoding: 'json',
});

module.exports = leveldb;
