const Firebase = require('./firebase');

const db = new Firebase();
const orderId = '-L8_ArD4o2KJGJ1r96_Z';
const storeId = '-L6gqAic0SFB-tk_x4Um';
const uid = 'lftwM7KOcGgV7dHXu5mwdaW4t6Y2';
const order = [{ id: '-L6gqAkn-dJKfqcMIiCH', count: 1 }];

// db.createOrder(orderId, storeId, uid, order);
db.readStore(storeId).then((data) => {
    console.log(data.key);
});
// db.readMenus(storeId).then((data) => {
//     console.log(typeof data);
// });
// db.readUserInfo().then((data) => {
//     console.log(data);
// });
