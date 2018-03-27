// https://firebase.google.com/docs/reference/admin/node/admin.database
const admin = require('firebase-admin');
const serviceAccount = require('./goodfood-new-adminsdk-private-key.json');
var store = null;

module.exports = class firebase {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://goodfood-new.firebaseio.com'
        });
        store = admin.database().ref('store');
    }
    create() {

    }
    readStore(key) {
        return new Promise((resolve, reject) => {
            let result = null;
            if (key) {
                result = store.once('value')
                    .then(snapshot => {
                        if (snapshot.child(`${key}`).exists()) {
                            return snapshot.child(`${key}`).val();
                        }
                    });
            } else {
                result = store.once('value')
                    .then(snapshot => {
                        return snapshot.val();
                    });
            }
            resolve(result);
        });
    }
    update() {

    }
    delete() {

    }

}
