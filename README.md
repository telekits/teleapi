# TeleAPI
> The useful library to simplify your work with Telegram Bot Api

> Bot API 2.1

```javascript
const teleapi = require('teleapi');
const api = teleapi('Bot Auth Token');

// or

const api = require('teleapi')('Bot Auth Token');

// ...and send requests...
```
### [Documentation](https://core.telegram.org/bots/api "Telegram Bot API Documentation")

## Install
```npm
$ npm install teleapi
```

## Available types
> Current list of available types [here](https://core.telegram.org/bots/api#available-types "Telegram Bot API Available Types")

## Available methods
> Current list of available methods [here](https://core.telegram.org/bots/api#available-methods "Telegram Bot API Available Methods")


```javascript
const api = require('teleapi')('Bot Auth Token');

api.<methodName>(params, callback);
```

**Params is an Object**
```javascript
// example params for sendMessage
const params = {
  "chat_id": 000000, // Unique identifier for the message recipient — User or GroupChat id
  "text": "goodnight!" // Text of the message to be sent
}
```
**Callback is an Function**
```javascript
function callback(error, result) {
// if "error" is an true to then the "result" is an error object.
}
```

## Send request
```javascript
const api = require('teleapi')('Bot Auth Token');

// send request
api.getMe(callback);
// send request with parameters
api.sendMessage({
  chat_id: 000000, // chat id
  text: "Hello!"
}, callback);
```

## Download Files
```javascript
const api = require('teleapi')('Bot Auth Token');

// Get File Path
api.getFile({
  file_id: "BQADAgADhwEAAryGFQABzzmo9UdRnXkC",
}, (error, result) => {
  ...
  // TeleAPI#file returned "request" object, see link down.
  api.file(result.file_path)
     .pipe(fs.createWriteStream('image.png'));
  ...
});
```
> [Request Streaming](https://github.com/request/request#streaming)


## Send InputFile
> photo, audio, document, sticker, video, etc...

```javascript
const api = require('teleapi')('Bot Auth Token');

// Support Stream
const fs = require('fs');
const data = fs.createReadStream(filename);

// Support Buffer
const data = new Buffer([1, 2, 3]);

// Support String(file_id)
const data = "file_id";

api.sendDocument({
  chat_id: 000000, // chat id
  document: data
}, callback);

// or

api.sendDocument({
  chat_id: 000000, // chat id
  document: {
    value: data,
    options: {
      filename: "test.jpg",
      contentType: "image/jpg"
    }
  }
}, callback);

```

## LICENSE
[MIT](./LICENSE "The MIT License")
