const { WebClient } = require('@slack/client');
const express = require('express');
const leveldb = require('../../leveldb');
const SLACK = require('../../config/slack.json');
const VIEW = require('../../config/view.json');
const Firebase = require('../../firebase');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();
const firebasedb = new Firebase();

router.post('/', (req, res, next) => {
    // parse payload
    const payload = JSON.parse(req.body.payload);
    const callbacks = payload.callback_id.split('/');

    if (callbacks[0] === 'add_in') {
        // 更新call_back
        const orderId = callbacks[1];
        const orderstore = callbacks[2];
        const btn = JSON.parse(JSON.stringify(VIEW.three_btn));
        btn.callback_id = `button_click/${orderId}/${orderstore}`;

        // 發送訊息
        web.chat.postMessage(payload.user.id, '', { attachments: [btn] }).then((result) => {
            if (result.ok) {
                leveldb.get(`order/${orderId}`, (err, value) => {
                    let tempJSON = {
                        storeId: orderstore,
                        list: {},
                    };
                    if (!err) {
                        tempJSON = JSON.parse(value);
                    }
                    tempJSON.list[payload.user.id] = { list: [] };
                    leveldb.put(`order/${orderId}`, JSON.stringify(tempJSON));
                    res.end();
                });
            }
        }).catch(() => {
            res.status(400);
            res.end();
        });
    }

    // button_click happen
    if (callbacks[0] === 'button_click') {
        // open dialog event
        if (payload.actions[0].name === 'order') {
            // add order list to the selecter of dialog in array
            const orderstore = callbacks[2];
            const dialog = JSON.parse(JSON.stringify(VIEW.order_dialog));
            let storeName = '';
            let storeFood = {};

            leveldb.get(`store/${orderstore}`, (err, value) => {
                if (!err) {
                    storeFood = JSON.parse(value);
                    storeName = storeFood.name;

                    dialog.title = storeName !== '' ? storeName : '選擇餐點';
                    dialog.callback_id = `add_order/${callbacks[1]}/${orderstore}/${payload.message_ts}`;
                    dialog.elements[0].options = Object.keys(storeFood.food).map((k, i) => {
                        const labelV = `${storeFood.food[k].name} $${storeFood.food[k].price}`;
                        const valueV = `${k}`;
                        return { label: labelV, value: valueV };
                    });

                    web.dialog.open(JSON.stringify(dialog), payload.trigger_id).then((result) => {
                        if (result.ok) {
                            res.end();
                        }
                    }).catch(() => {
                        res.status(400);
                        res.end();
                    });
                }
            });
        }

        // clear order list
        if (payload.actions[0].name === 'clear') {
            const orderId = callbacks[1];
            const orderstore = callbacks[2];
            const btn = JSON.parse(JSON.stringify(VIEW.three_btn));
            btn.callback_id = `button_click/${orderId}/${orderstore}`;

            leveldb.get(`order/${orderId}`, (err, value) => {
                let tempJSON = {
                    storeId: orderstore,
                    list: {},
                };
                if (!err) {
                    tempJSON = JSON.parse(value);
                }
                tempJSON.list[payload.user.id] = { list: [] };
                leveldb.put(`order/${orderId}`, JSON.stringify(tempJSON));
                web.chat.update(payload.message_ts, payload.channel.id, '', { attachments: [btn] }).then((result) => {
                    if (result.ok) {
                        res.end();
                    }
                }).catch(() => {
                    res.end();
                });
            });
        }

        // submit order to firebase
        if (payload.actions[0].name === 'submit') {
            const orderId = callbacks[1];
            const orderstore = callbacks[2];
            const orderlist = JSON.parse(JSON.stringify(VIEW.order_list));
            const ok = JSON.parse(JSON.stringify(VIEW.order_complete));
            let storeName = '';
            let storeFood = {};

            (async () => {
                storeFood = await leveldb.get(`store/${orderstore}`);
                storeFood = JSON.parse(storeFood);
                storeName = storeFood.name;

                let thisorder = await leveldb.get(`order/${orderId}`);
                thisorder = JSON.parse(thisorder);

                let all = 0;
                orderlist.pretext = `:curry: ${storeName} - 你的訂單`;
                orderlist.ts = Date.now() / 1000;
                thisorder.list[payload.user.id].list.forEach((food) => {
                    orderlist.fields.push({
                        title: `${storeFood.food[food.foodId].name} $${storeFood.food[food.foodId].price} * ${food.num}  =  $${food.price}`,
                        short: false,
                    });
                    all += food.price;
                });

                orderlist.fields.push({
                    title: `總金額 ： $${all}`,
                    short: false,
                });

                web.chat.update(payload.message_ts, payload.channel.id, '', { attachments: [orderlist, ok] }).then((result) => {
                    if (result.ok) {
                        res.end();
                    }
                }).catch(() => {
                    res.end();
                });
                res.end();
            })().catch((e) => {
                console.log(e);
                res.end();
            });
        }
    }

    // add order happen
    if (callbacks[0] === 'add_order') {
        const orderId = callbacks[1];
        const orderstore = callbacks[2];
        const timeStamp = callbacks[3];
        const btn = JSON.parse(JSON.stringify(VIEW.three_btn));
        const orderlist = JSON.parse(JSON.stringify(VIEW.order_list));
        let storeName = '';
        let storeFood = {};
        btn.callback_id = `button_click/${orderId}/${orderstore}`;

        (async () => {
            storeFood = await leveldb.get(`store/${orderstore}`);
            storeFood = JSON.parse(storeFood);
            storeName = storeFood.name;

            let thisorder = await leveldb.get(`order/${orderId}`);
            thisorder = JSON.parse(thisorder);

            const fid = payload.submission.order_list;
            const n = Number(payload.submission.num);
            if (Number.isInteger(n) && n > 0) {
                thisorder.list[payload.user.id].list.push({
                    foodId: fid,
                    num: n,
                    price: n * storeFood.food[fid].price,
                });
                await leveldb.put(`order/${orderId}`, JSON.stringify(thisorder));
            }

            let all = 0;
            orderlist.pretext = `:curry: ${storeName} - 你的訂單`;
            orderlist.ts = Date.now() / 1000;
            thisorder.list[payload.user.id].list.forEach((food) => {
                orderlist.fields.push({
                    title: `${storeFood.food[food.foodId].name} $${storeFood.food[food.foodId].price} * ${food.num}  =  $${food.price}`,
                    short: false,
                });
                all += food.price;
            });

            orderlist.fields.push({
                title: `總金額 ： $${all}`,
                short: false,
            });

            web.chat.update(timeStamp, payload.channel.id, '', { attachments: [orderlist, btn] }).then((result) => {
                if (result.ok) {
                    res.end();
                }
            }).catch(() => {
                res.end();
            });
            res.end();
        })().catch((e) => {
            console.log(e);
            res.end();
        });
    }

    if (callbacks[0] === 'no_callback') {
        res.end();
    }
});

module.exports = router;
