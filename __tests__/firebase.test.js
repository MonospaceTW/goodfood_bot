const Firebase = require('../firebase');

const firebase = new Firebase();
const orderId = '-L8I13PKjHIBUzkihY7j';
const storeId = '-L6gqAi_qmpvw8YNMgRh';
const uid = 'lftwM7KOcGgV7dHXu5mwdaW4t6Y2';
const order = [{ id: '-L6gqAjKu3hUkyN3b6ZO', count: 1 }, { id: '-L6gqAjKu3hUkyN3b6ZO', count: 10 }, { id: '-L6gqAjLnY7sT7KsttJO', count: 1 }, { id: '-L6gqAjLnY7sT7KsttJO', count: 10 }];

test('Get all stores.', async () => {
    await firebase.readStore().then((data) => {
        expect(data).not.toBeNull();
    });
});

test('Get the unique store.', async () => {
    await firebase.readStore(storeId).then((data) => {
        expect(data).not.toBeNull();
    });
});

test('Get the unique store menus.', async () => {
    await firebase.readMenus(storeId).then((data) => {
        expect(data).not.toBeNull();
    });
});

test('Create order.', async () => {
    await firebase.createOrder(orderId, storeId, uid, order).then((data) => {
        expect(data.total).toBe(1595);
        expect(Object.keys(data.order).length).toBe(2);
    });
});
