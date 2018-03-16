const { WebClient } = require('@slack/client');
const express = require('express');
const leveldb = require('../../leveldb');
const SLACK = require('../../config/slack.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);
const router = express.Router();

const dialog = {
    callback_id: 'add_order',
    title: '選擇餐點',
    submit_label: 'Submit',
    elements: [
        {
            label: '訂單列表',
            name: 'order_list',
            type: 'select',
            placeholder: '選擇餐點',
            options: [],
        },
        {
            label: '數量',
            name: 'num',
            type: 'text',
            subtype: 'number',
            placeholder: '0',
        },
    ],
};

const btn = {
    fallback: '你可以在 slack 點餐',
    callback_id: 'button_click',
    color: '#3AA3E3',
    actions: [
        {
            name: 'clear',
            text: '清除所有點餐',
            type: 'button',
            value: 'Y87G87',
        },
        {
            name: 'order',
            text: '新增點餐',
            type: 'button',
            value: 'Y87G87',
        },
        {
            name: 'submit',
            text: '送出點餐',
            type: 'button',
            value: 'Y87G87',
        },
    ],
};

router.post('/', (req, res, next) => {
    // parse payload
    const payload = JSON.parse(req.body.payload);
    if (payload.callback_id === 'add_in') {
        // 更新按鈕上的訂單編號
        const orderId = payload.actions[0].value;
        btn.actions.forEach((act) => {
            act.value = orderId;
        });
        web.chat.update(payload.message_ts, payload.channel.id, '', { attachments: [btn] }).then((result) => {
            if (result.ok) {
                leveldb.get('order', (err, value) => {
                    let tempJSON = {};
                    if (!err) {
                        tempJSON = JSON.parse(value);
                    }
                    tempJSON[orderId].list[payload.user.id] = {};
                    tempJSON[orderId].list[payload.user.id].channelid = payload.channel.id;
                    tempJSON[orderId].list[payload.user.id].mts = payload.message_ts;
                    tempJSON[orderId].list[payload.user.id].olist = [];
                    leveldb.put('order', JSON.stringify(tempJSON));
                    res.end();
                });
            }
        }).catch(() => {
            res.end();
        });
    }

    // button_click happen
    if (payload.callback_id === 'button_click') {
        // open dialog event
        if (payload.actions[0].name === 'order') {
            // add order list to the selecter of dialog in array
            const displayDialog = JSON.parse(JSON.stringify(dialog));
            displayDialog.elements[0].options = [
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

            // add order id to the top of dialog
            displayDialog.elements.unshift({
                label: '訂單編號',
                name: 'order_id',
                type: 'text',
                value: 'Y87G87',
            });

            web.dialog.open(JSON.stringify(displayDialog), payload.trigger_id).then((result) => {
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
            const orderId = payload.actions[0].value;
            btn.actions.forEach((act) => {
                act.value = orderId;
            });
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
    if (payload.callback_id === 'add_order') {
        const orderId = payload.submission.order_id;
        btn.actions.forEach((act) => {
            act.value = orderId;
        });
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
            let aaa;
            aaa = {
                text: '**訂單列表**',
                color: '#123456',
                fields: [],
            };
            tempJSON[orderId].list[payload.user.id].olist.forEach((food) => {
                aaa.fields.push({
                    value: `${food.foodid} x ${food.num} = $${food.price}`,
                });
            });
            aaa.fields.push({
                value: '總共：$320',
            });
            aaa.fields.push({
                title: '________________________',
            });

            web.chat.update(tempJSON[orderId].list[payload.user.id].mts, payload.channel.id, '', { attachments: [aaa, btn] }).then((result) => {
                if (result.ok) {
                    res.end();
                }
            }).catch(() => {
                res.end();
            });
        });
        res.end();
    }
});

module.exports = router;
