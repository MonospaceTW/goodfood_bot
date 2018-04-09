const { WebClient } = require('@slack/client');
const leveldb = require('../../../leveldb');
const SLACK = require('../../../config/slack.json');
const TWOBTN = require('../../../templates/two_btn.json');
const ORDEROK = require('../../../templates/order_ok.json');
const Firebase = require('../../../services/firebase/firebase');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const firebasedb = new Firebase();

module.export = async (payload, res) => {
    const callbacks = payload.callback_id.split('/');
    const orderId = callbacks[1];
    const orderStore = callbacks[2];

    // clear order list
    if (payload.actions[0].name === 'clear') {
        const btn = JSON.parse(JSON.stringify(TWOBTN));
        btn.callback_id = `button_click/${orderId}/${orderStore}`;
        await leveldb.put(`order/${orderId}/${payload.user.id}`, JSON.stringify({ list: [] }));
        web.chat.update(payload.message_ts, payload.channel.id, '', { attachments: [payload.original_message.attachments.shift(), payload.original_message.attachments.pop()] }).then((result) => {
            if (result.ok) {
                res.end();
            }
        }).catch(() => {
            res.end();
        });
        res.end();
    }

    // submit order to firebase
    if (payload.actions[0].name === 'submit') {
        const ok = JSON.parse(JSON.stringify(ORDEROK));
        payload.original_message.attachments.shift();
        payload.original_message.attachments.pop();

        // submit order
        let orderList = await leveldb.get(`order/${orderId}/${payload.user.id}`);
        orderList = JSON.parse(orderList);
        const order = orderList.list.map((o, i) => {
            return { id: o.foodId, count: o.num };
        });
        firebasedb.createOrder(orderId, orderStore, 'lftwM7KOcGgV7dHXu5mwdaW4t6Y2', order);
        web.chat.update(payload.message_ts, payload.channel.id, '', { attachments: [payload.original_message.attachments[0], ok] }).then((result) => {
            if (result.ok) {
                res.end();
            }
        }).catch(() => {
            res.end();
        });
        res.end();
    }
};
