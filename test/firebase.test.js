const Firebase = require('../firebase');

const firebase = new Firebase();
// const orderId = '-L8_ArD4o2KJGJ1r96_Z';
const storeId = '-L6gqAic0SFB-tk_x4Um';
// const uid = 'lftwM7KOcGgV7dHXu5mwdaW4t6Y2';
// const order = [{ id: '-L6gqAkn-dJKfqcMIiCH', count: 1 }];

test('Get all stores.', () => {
    firebase.readStore().then((data) => {
        expect(Object.keys(data).length).toBe(15);
    });
});

test('Get the unique store.', () => {
    firebase.readStore(storeId).then((data) => {
        expect(data).not().toBeNull();
    });
});

test('Get the unique store menus.', () => {
    firebase.readMenus(storeId).then((data) => {
        expect(data).not().toBeNull();
    });
});
