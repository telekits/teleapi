# TeleAPI
> The useful library to simplify your work with Telegram Bot API

> Supported of Telegram Bot API 2.2.1!

```javascript
const teleapi = require('teleapi');
const api = teleapi('Bot Auth Token');

/** or */

const api = require('teleapi')('Bot Auth Token');

/** ...and send requests... */
```
### [Bot API manual](https://core.telegram.org/bots/api "Telegram Bot API")

## Install
```npm
$ npm install teleapi --save
```

## Available Types
> [Current list of Available Types](https://core.telegram.org/bots/api#available-types "Telegram Bot API Available Types")

## Available Methods
> [Current list of Available Methods](https://github.com/nof1000/teleapi/blob/master/api.json "api.json")


```javascript
const api = require('teleapi')('Bot Auth Token');

api.methodName(params, callback);
```

**`params` is an `Object`**
```javascript
/** example params for sendMessage */
const params = {
  chat_id: 000000, // Unique identifier for the message recipient — User or GroupChat id
  text: 'hello!' // Text of the message to be sent
}
```
**`callback` is an `Function`**
```javascript
function callback(error, result) {
  /** ... */
}
```
**`methodName` returns a `Promise`**
```javascript
api.methodName(params).then(result => {
  /** ... */
}).catch(error => {
  /** ... */ 
});
```

## Request
```javascript
const api = require('teleapi')('Bot Auth Token');

api.getMe(callback);
/** or */
api.getMe().then(result => {
  /** ... */
}).catch(error => {
  /** ... */
});

/** Example of Send Message */
api.sendMessage({
  chat_id: 000000, // chat id
  text: "Hello!"
}).then(result => {
  /** ... */
}).catch(error => {
  /** ... */
});
```

## Get File
```javascript
const api = require('teleapi')('Bot Auth Token');
const fs = require('fs');

/** returns Stream */
api.getFile('file_id').pipe(fs.createWriteStream('file.ext'));
```

## Send File
> photo, audio, document, sticker, video, etc...

```javascript
const api = require('teleapi')('Bot Auth Token');

/** Support Stream */
const fs = require('fs');
const data = fs.createReadStream('myfile.ext');

/** Support Buffer */
const data = new Buffer([1, 2, 3]);

/** Support String(file_id) */
const data = "file_id";

api.sendDocument({
  chat_id: 000000, // chat id
  document: data
});

/** or */

api.sendDocument({
  chat_id: 000000, // chat id
  document: {
    filename: 'myfile.jpg',
      value: data,
      mime: "image/jpg"
    }
  }
});

```

## LICENSE
[MIT](./LICENSE "The MIT License")
