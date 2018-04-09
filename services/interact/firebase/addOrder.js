const { WebClient } = require('@slack/client');
const leveldb = require('../../../leveldb');
const SLACK = require('../../../config/slack.json');
const TWOBTN = require('../../../templates/two_btn.json');
const ORDERMENU = require('../../../templates/food_menu.json');
const ORDERLIST = require('../../../templates/order_list.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);

module.exports = async (payload, res) => {
    const callbacks = payload.callback_id.split('/');
    const orderId = callbacks[1];
    const orderStore = callbacks[2];

    const foodId = callbacks[3];
    const timeStamp = callbacks[4];
    const btn = JSON.parse(JSON.stringify(TWOBTN));
    const menu = JSON.parse(JSON.stringify(ORDERMENU));
    const orderList = JSON.parse(JSON.stringify(ORDERLIST));

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
};
