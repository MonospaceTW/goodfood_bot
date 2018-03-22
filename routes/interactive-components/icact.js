const { WebClient } = require('@slack/client');
const express = require('express');
const leveldb = require('../../leveldb');
const SLACK = require('../../config/slack.json');
const VIEW = require('../../config/view.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();

router.post('/', (req, res, next) => {
    // parse payload
    const payload = JSON.parse(req.body.payload);
    const callbacks = payload.callback_id.split('/');

    if (callbacks[0] === 'add_in') {
        // 更新call_back
        const orderId = callbacks[1];
        const btn = VIEW.three_btn;
        btn.callback_id = `button_click/${orderId}`;

        // 發送訊息
        web.chat.postMessage(payload.user.id, '', { attachments: [btn] }).then((result) => {
            if (result.ok) {
                leveldb.get('order', (err, value) => {
                    let tempJSON = {};
                    if (!err) {
                        tempJSON = JSON.parse(value);
                    }
                    tempJSON[orderId].list[payload.user.id] = {};
                    tempJSON[orderId].list[payload.user.id].olist = [];
                    leveldb.put('order', JSON.stringify(tempJSON));
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
            const dialog = VIEW.order_dialog;
            dialog.callback_id = `add_order/${callbacks[1]}/${payload.message_ts}`;
            dialog.elements[0].options = [
                {
                    label: '大便當 $90',
                    value: 'id01',
                },
                {
                    label: '小便當 $85',
                    value: 'id02',
                },
                {
                    label: '阿嬤大便當 $150',
                    value: 'id03',
                },
                {
                    label: '媽媽+阿嬤聯合大便當 $299',
                    value: 'id04',
                },
                {
                    label: '紅茶 $25',
                    value: 'id05',
                },
            ];

            web.dialog.open(JSON.stringify(dialog), payload.trigger_id).then((result) => {
                if (result.ok) {
                    res.end();
                }
            }).catch(() => {
                res.status(400);
                res.end();
            });
        }

        // clear order list
        if (payload.actions[0].name === 'clear') {
            const orderId = callbacks[1];
            const btn = VIEW.three_btn;
            btn.callback_id = `button_click/${orderId}`;

            leveldb.get('order', (err, value) => {
                let tempJSON = {};
                if (!err) {
                    tempJSON = JSON.parse(value);
                }
                tempJSON[orderId].list[payload.user.id].olist = [];
                leveldb.put('order', JSON.stringify(tempJSON));

                web.chat.update(payload.message_ts, payload.channel.id, '', { attachments: [btn] }).then((result) => {
                    if (result.ok) {
                        res.end();
                    }
                }).catch(() => {
                    res.end();
                });
            });
        }

        // submit order
        if (payload.actions[0].name === 'submit') {
            // submit here
            res.end();
        }
    }

    // add order happen
    if (callbacks[0] === 'add_order') {
        const orderId = callbacks[1];
        const timeStamp = callbacks[2];
        const btn = VIEW.three_btn;
        btn.callback_id = `button_click/${orderId}`;

        leveldb.get('order', (err, value) => {
            let tempJSON = {};
            if (!err) {
                tempJSON = JSON.parse(value);
            }
            tempJSON[orderId].list[payload.user.id].olist.push({
                foodid: payload.submission.order_list,
                num: payload.submission.num,
                price: 200,
            });
            leveldb.put('order', JSON.stringify(tempJSON));
            const orderText = {
                text: '**訂單列表**',
                color: '#123456',
                fields: [],
            };

            tempJSON[orderId].list[payload.user.id].olist.forEach((food) => {
                orderText.fields.push({
                    value: `${food.foodid} x ${food.num} = $${food.price}`,
                });
            });
            orderText.fields.push({
                value: '總共：$320',
            });
            orderText.fields.push({
                title: '________________________',
            });

            web.chat.update(timeStamp, payload.channel.id, '', { attachments: [orderText, btn] }).then((result) => {
                if (result.ok) {
                    res.end();
                }
            }).catch(() => {
                res.end();
            });
        });
        res.end();
    }

    if (callbacks[0] === 'no_callback') {
        res.end();
    }
});

module.exports = router;
