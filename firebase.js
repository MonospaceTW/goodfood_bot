const _object = require('lodash/object');
const admin = require('firebase-admin');
const serviceAccount = require('./config/goodfood-new-adminsdk-private-key.json');

/**
 * @description Firebase Admin SDK Docs Overview - Node.js
 * @see https://firebase.google.com/docs/reference/admin/node/
 */
module.exports = class firebase {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://goodfood-new.firebaseio.com',
        });
        this.USER = admin.auth();
        this.STORE = admin.database().ref('store');
        this.ORDER = admin.database().ref('order');
    }

    /**
     * @description 下訂單
     * @param  {String} orderId 訂單編號
     * @param  {String} storeId 店家編號
     * @param  {String} uid 使用者編號
     * @param  {Array} order 訂單內容
     */
    createOrder(orderId, storeId, uid, order) {
        return new Promise((resolve, reject) => {
            try {
                const user = {
                    id: uid,
                    mark: '',
                    name: '',
                    order: {},
                    total: 0,
                };

                // set user name
                const a = this.USER.getUser(uid).then((val) => {
                    user.name = val.displayName;
                });

                // set user's order
                const b = order.map(element =>
                    this.STORE.child(`${storeId}/menus/${element.id}`)
                        .once('value')
                        .then(snapshot =>
                            new Promise((_resolve) => {
                                const val = snapshot.val();
                                val.count = element.count;
                                val.total = element.count * val.price;
                                _object.updateWith(user, `[order][${snapshot.key}]`, () => val, Object);
                                user.total += val.total;
                                _resolve();
                            })));

                Promise.all([a, ...b])
                    .then(() => {
                        // update order total price
                        this.ORDER.child(`/${orderId}/result/total`)
                            .once('value')
                            .then((snapshot) => {
                                this.ORDER.child(`/${orderId}/result/total`).set(snapshot.val() + user.total);
                            });

                        // update user's order
                        this.ORDER.child(`${orderId}/result/users/${uid}`).update(user);
                    })
                    .then(() => {
                        resolve();
                    });
            } catch (error) {
                reject(new Error(error));
            }
        });
    }

    /**
     * @description 取得店家資訊
     * @param  {String} storeId 店家編號（若不填則取得所有店家）
     */
    readStore(storeId) {
        return new Promise((resolve, reject) => {
            try {
                let result = null;
                this.STORE.once('value').then((snapshot) => {
                    if (storeId) {
                        if (snapshot.child(`${storeId}`).exists()) {
                            result = snapshot.child(`${storeId}`).val();
                        }
                    } else {
                        result = snapshot.val();
                    }
                    resolve(result);
                });
            } catch (error) {
                reject(new Error(error));
            }
        });
    }

    /**
     * @description 取得店家菜單
     * @param  {String} storeId 店家編號
     */
    readMenus(storeId) {
        return new Promise((resolve, reject) => {
            try {
                this.STORE.once('value')
                    .then(snapshot =>
                        new Promise((_resolve, _reject) => {
                            if (snapshot.child(`${storeId}`).exists()) {
                                _resolve(snapshot.child(`${storeId}/menus`).val());
                            } else {
                                _reject(new Error('無此店家'));
                            }
                        }))
                    .then((data) => {
                        resolve(data);
                    });
            } catch (error) {
                reject(new Error(error));
            }
        });
    }

    /**
     * @description 取得使用者資訊
     * @param  {String} uid 使用者編號（若不填則取得所有使用者）
     */
    readUserInfo(uid) {
        return new Promise((resolve, reject) => {
            try {
                if (uid) {
                    this.USER.getUser(uid).then((data) => {
                        resolve(data);
                    });
                } else {
                    this.USER.listUsers().then((data) => {
                        resolve(data);
                    });
                }
            } catch (error) {
                reject(new Error(error));
            }
        });
    }
};
