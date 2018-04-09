const { WebClient } = require('@slack/client');
const leveldb = require('../../../leveldb');
const SLACK = require('../../../config/slack.json');
const FOODDIALOG = require('../../../templates/food_dialog.json');

const token = SLACK.BOT_TOKEN;

const web = new WebClient(token);

module.export = async (payload, res) => {
    const callbacks = payload.callback_id.split('/');
    const orderStore = callbacks[2];
    const foodId = payload.actions[0].selected_options[0].value;
    const foodDialog = JSON.parse(JSON.stringify(FOODDIALOG));

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
};
