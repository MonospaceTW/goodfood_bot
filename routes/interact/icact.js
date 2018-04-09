const { WebClient } = require('@slack/client');
const express = require('express');
const leveldb = require('../../leveldb');
const SLACK = require('../../config/slack.json');
const VIEW = require('../../config/view.json');
const Firebase = require('../../services/firebase/firebase');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();
const firebasedb = new Firebase();

router.post('/', async (req, res, next) => {
    // parse payload
    const payload = JSON.parse(req.body.payload);
    const callbacks = payload.callback_id.split('/');
    const orderId = callbacks[1];
    const orderStore = callbacks[2];

    if (callbacks[0] === 'add_in') {
        // 更新call_back
        const btn = JSON.parse(JSON.stringify(VIEW.two_btn));
        const menu = JSON.parse(JSON.stringify(VIEW.order_menu));
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
    }

    // food option
    if (callbacks[0] === 'choose_food') {
        const foodId = payload.actions[0].selected_options[0].value;
        const foodDialog = JSON.parse(JSON.stringify(VIEW.food_dialog));

        let storeFood = await leveldb.get(`store/${orderStore}`);
        storeFood = JSON.parse(storeFood);
        // get food options here
        const foodName = storeFood.food[foodId].name;
        foodDialog.callback_id = `add_order/${callbacks[1]}/${orderStore}/${foodId}/${payload.message_ts}`;
        foodDialog.title = `${foodName} - 選項(可能需要加錢)`;

        for (let i = 1; i < 4; i += 1) {
            foodDialog.elements[i].options.push({ label: '加飯', value: '1' });
            foodDialog.elements[i].options.push({ label: '加麵', value: '2' });
            foodDialog.elements[i].options.push({ label: '加蛋', value: '3' });
        }

        web.dialog.open(JSON.stringify(foodDialog), payload.trigger_id).then((result) => {
            if (result.ok) {
                res.end();
            }
        }).catch(() => {
            res.status(400);
            res.end();
        });

        res.end();
    }

    // button_click happen
    if (callbacks[0] === 'button_click') {
        // clear order list
        if (payload.actions[0].name === 'clear') {
            const btn = JSON.parse(JSON.stringify(VIEW.two_btn));
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
            const ok = JSON.parse(JSON.stringify(VIEW.order_complete));
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
    }

    // add order happen
    if (callbacks[0] === 'add_order') {
        const foodId = callbacks[3];
        const timeStamp = callbacks[4];
        const btn = JSON.parse(JSON.stringify(VIEW.two_btn));
        const menu = JSON.parse(JSON.stringify(VIEW.order_menu));
        const orderList = JSON.parse(JSON.stringify(VIEW.order_list));

        btn.callback_id = `button_click/${orderId}/${orderStore}`;
        menu.callback_id = `choose_food/${orderId}/${orderStore}`;
        let storeName = '';
        let storeFood = {};

        storeFood = await leveldb.get(`store/${orderStore}`);
        storeFood = JSON.parse(storeFood);
        storeName = storeFood.name;

        // handle menu
        menu.actions[0].options = Object.keys(storeFood.food).map((k, i) => {
            const text = `${storeFood.food[k].name} $${storeFood.food[k].price}`;
            const value = `${k}`;
            return { text, value };
        });
        menu.pretext = `${storeFood.name}`;

        // food option
        const opArr = [];
        if (payload.submission.option1) {
            opArr.push(payload.submission.option1);
        }
        if (payload.submission.option2) {
            opArr.push(payload.submission.option2);
        }
        if (payload.submission.option3) {
            opArr.push(payload.submission.option3);
        }

        // store to database
        let thisOrder = await leveldb.get(`order/${orderId}/${payload.user.id}`);
        thisOrder = JSON.parse(thisOrder);

        const num = Number(payload.submission.num);
        if (Number.isInteger(num) && num > 0) {
            thisOrder.list.push({
                foodId,
                num,
                price: num * storeFood.food[foodId].price,
                option: opArr,
            });
            await leveldb.put(`order/${orderId}/${payload.user.id}`, JSON.stringify(thisOrder));
        }


        // show order
        let all = 0;
        const opArrr = ['加飯', '加麵', '加蛋'];

        orderList.pretext = `:curry: ${storeName} - 你的訂單`;
        orderList.ts = Date.now() / 1000;
        thisOrder.list.forEach((food) => {
            let opText = '';
            food.option.forEach((op) => {
                opText += ` (${opArrr[Number(op) - 1]})`;
            });
            orderList.fields.push({
                title: `${storeFood.food[food.foodId].name}${opText} $${storeFood.food[food.foodId].price} * ${food.num}  =  $${food.price}`,
                short: false,
            });
            all += food.price;
        });

        orderList.fields.push({
            title: `總金額 ： $${all}`,
            short: false,
        });

        web.chat.update(timeStamp, payload.channel.id, '', { attachments: [menu, orderList, btn] }).then((result) => {
            if (result.ok) {
                res.end();
            }
        }).catch(() => {
            res.end();
        });
        res.end();
    }

    if (callbacks[0] === 'no_callback') {
        res.end();
    }
});

module.exports = router;
