const fireBaseService = require('./firebase');

module.exports = class Services {

    constructor() {
        global.firebaseService = new fireBaseService();
    }
}