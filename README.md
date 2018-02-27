# GoodFood-Bot Usage

## API
- [API列表](https://app.swaggerhub.com/apis/kwchung/goodfood_test/1.0.0)

## Test API

```
$ curl -d "message=這是一則給 #test-bot 而且來自於 \*紅色巨鳥\*.\<https://www.google.com.tw>" -H "Content-Type: application/x-www-form-urlencoded" -X POST http://goodfood-beta.trunksys.com/message
```

## Response
- {"ok": true}
- {"ok": false}

## Other
- 目前只會傳到 #test-bot 裡
- \***裡面會是粗體字**\*
- <裡面會是網址>  用非網址文字會變箭頭括號包起來的文字

<hr>

# Installation

## Install curl

```
$ sudo apt-get install curl
```

## Install nvm

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
```

## Install nodejs

```
$ nvm install v8.9.1
```

## Create slack app and get token

- [slack app網址](https://api.slack.com/apps)
- 點擊 Create New App ， 會導向 App 資訊頁
- 展開 Add features and functionality
- 點擊 Bots 新增一個機器人
- 回到 App 資訊頁
- 展開 Install your app to your workspace 並安裝 App 到你的 slack workplace
- 安裝成功之後回到 App 資訊頁
- 展開 Add features and functionality
- 點擊 Permissions
- 可以看到有 Bot User OAuth Access Token 這一欄位
- 保管好你的機器人 Token ， 不要被A走

## Download project

```
$ git clone https://github.com/MonospaceTW/goodfood_bot.git
$ cd goodfood_bot
```

## Modify token

- 在跟 app.js 同一層資料夾創建 config.json
- 輸入
```json
{
    "bot_token" : "your-bot-token"
}
```
- 存檔退出

## Modify port

- 開啟 /bin/www
- 修改你要的 port
```javascript
const port = '1234'; // modify your port here
```
- 存檔退出

## Run

```
$ npm install
$ npm start
```
