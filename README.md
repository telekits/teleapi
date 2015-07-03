# TeleAPI
Telegram Bot API wrapper

```javascript
var api = new (require('teleapi'))('Bot Auth Token');
// ...and send requests...
```

## Install
```npm
$ npm install teleapi
```

## Available methods
>Current list of available methods [here](https://core.telegram.org/bots/api#available-methods "Telegram Bot API Available Methods")

```javascript
var api = new (require('teleapi'))('Bot Auth Token');
api.<methodName>(params, callback);
```

**Params is Object**
```javascript
// example params for sendMessage
var params = {
  "chat_id": 000000, // Unique identifier for the message recipient — User or GroupChat id
  "text": "goodnight!" // Text of the message to be sent
}
```
**Callback is Function**
```javascript
function callback(error, result) {
// if "error" is true to then the result is error object.
}
```

## Send request
```javascript
var api = new (require('teleapi'))('Bot Auth Token');

// send request
api.getMe(callback);
// send request with parameters
api.sendMessage({
  "chat_id": 000000, // chat id
  "text": "Hello!"
}, callback);
```

## Send InputFile
> photo, audio, document, sticker, video

```javascript
var api = new (require('teleapi'))('Bot Auth Token');
    
// Support Stream
var fs = require('fs');
var data = fs.createReadStream(filename);
// Support Buffer
var data = new Buffer([1, 2, 3]);
// Support String(file_id)
var data = "file_id";
    
api.sendDocument({
  "chat_id": 000000, // chat id
  "document": data
}, callback);

// or

api.sendDocument({
  "chat_id": 000000, // chat id
  "document": {
    "value": data,
    "options" {
      "filename": "test.jpg",
      "contentType": "image/jpg"
    }
  }
}, callback);

```

## LICENSE
[MIT](./LICENSE "The MIT License")