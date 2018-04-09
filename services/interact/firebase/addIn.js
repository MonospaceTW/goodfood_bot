const { WebClient } = require('@slack/client');
const leveldb = require('../../../leveldb');
const SLACK = require('../../../config/slack.json');
const TWOBTN = require('../../../templates/two_btn.json');
const ORDERMENU = require('../../../templates/food_menu.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);

module.exports = async (payload, res) => {
    const callbacks = payload.callback_id.split('/');
    const orderId = callbacks[1];
    const orderStore = callbacks[2];

    const btn = JSON.parse(JSON.stringify(TWOBTN));
    const menu = JSON.parse(JSON.stringify(ORDERMENU));

    btn.callback_id = `button_click/${orderId}/${orderStore}`;
    menu.callback_id = `choose_food/${orderId}/${orderStore}`;

    let storeFood = await leveldb.get(`store/${orderStore}`);
    storeFood = JSON.parse(storeFood);
    menu.actions[0].options = Object.keys(storeFood.food).map((k, i) => {
        const text = `${storeFood.food[k].name} $${storeFood.food[k].price}`;
        const value = `${k}`;
        return { text, value };
    });
    menu.pretext = `:curry: ${storeFood.name}`;

    // 發送訊息
    const result = await web.chat.postMessage(payload.user.id, '', { attachments: [menu, btn] });
    if (result.ok) {
        await leveldb.put(`order/${orderId}/${payload.user.id}`, JSON.stringify({ list: [] }));
        res.end();
    } else {
        res.status(400);
        res.end();
    }

    res.end();
};
