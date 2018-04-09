const _object = require('lodash/object');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/goodfood-new-adminsdk-private-key.json');

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
                if (!order.length) {
                    throw new Error('必須要有訂單');
                }

                const checkOrder = this.ORDER.child(`${orderId}`)
                    .once('value')
                    .then(snapshot =>
                        new Promise((_resolve, _reject) => {
                            if (!snapshot.exists()) {
                                _reject(new Error('訂單不存在'));
                            }
                            _resolve();
                        }));

                const checkStore = this.STORE.child(`${storeId}`)
                    .once('value')
                    .then(snapshot =>
                        new Promise((_resolve, _reject) => {
                            if (!snapshot.exists()) {
                                _reject(new Error('店家不存在'));
                            }
                            _resolve();
                        }));

                const user = {
                    id: uid,
                    mark: '',
                    name: '',
                    order: {},
                    total: 0,
                };

                // set user name
                const a = this.USER.getUser(uid)
                    .then((val) => {
                        user.name = val.displayName;
                    })
                    .catch(err =>
                        new Promise((_resolve, _reject) => {
                            _reject(new Error(err));
                        }));

                // set user's order
                const b = order.map(element =>
                    this.STORE.child(`${storeId}/menus/${element.id}`)
                        .once('value')
                        .then(snapshot =>
                            new Promise((_resolve) => {
                                const val = snapshot.val();
                                val.count = element.count;
                                val.total = element.count * val.price;
                                _object.updateWith(
                                    user,
                                    `[order][${snapshot.key}]`,
                                    () => {
                                        const hasOrder = user.order[`${snapshot.key}`] === undefined;
                                        val.count += hasOrder ? 0 : user.order[`${snapshot.key}`].count;
                                        val.total += hasOrder ? 0 : user.order[`${snapshot.key}`].total;
                                        return val;
                                    },
                                    Object,
                                );
                                _resolve();
                            })));

                Promise.all([checkOrder, checkStore])
                    .then(() => {
                        Promise.all([a, ...b])
                            .then(() => {
                                // update user's order
                                _object.forIn(user.order, (value) => {
                                    user.total += value.total;
                                });
                                this.ORDER.child(`${orderId}/result/users/${uid}`).update(user);

                                // update order total price
                                this.ORDER.child(`/${orderId}/result/users`)
                                    .once('value')
                                    .then((snapshot) => {
                                        let total = 0;
                                        snapshot.forEach((childSnapshot) => {
                                            total += childSnapshot.val().total;
                                        });
                                        this.ORDER.child(`/${orderId}/result/total`).set(total);
                                    });
                            })
                            .then(() => {
                                resolve(user);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        reject(err);
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
                        } else {
                            reject(new Error('無此店家'));
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