<p align="center">
    <a href="#what-is-it" alt="teleapi">
        <img src=".github/header.png" alt="Header image"/>
    </a>
</p>

<p align="center">
    <a href="https://github.com/telekits/telekit">telekit</a>
    <strong>&emsp;&bull;&emsp;</strong>
    <strong>teleapi</strong>
</p>


[![Build Status](https://travis-ci.org/telekits/teleapi.svg?branch=master)](https://travis-ci.org/telekits/teleapi)
[![npm](https://img.shields.io/npm/v/teleapi.svg)](https://www.npmjs.com/package/teleapi)
[![npm](https://img.shields.io/npm/dt/teleapi.svg)](https://www.npmjs.com/package/teleapi)
[![Airbnb code style](https://img.shields.io/badge/code_style-Airbnb-ff69b4.svg)](https://github.com/sindresorhus/xo)
[![license](https://img.shields.io/github/license/telekits/teleapi.svg)](./LICENSE)


> Now support the Telegram Bot API 3.4 with Live Locations.


## What is it?
This is useful library to simplify your work with the Telegram Bot API
> Before you start, please, read an introduction for developers.  
> [Just a moment, I'll read it.](https://core.telegram.org/bots "Bots: an introduction for developers")


## Install
npm
```console
$ npm install teleapi --save
```

yarn
```console
$ yarn add teleapi
```


## How it use?
Elementary!
Look at the next example that show you how to send request to `getMe` method:
```javascript
/** First be we've required the teleapi */
const teleapi = require('teleapi');

/**
 * Next we need a get an instance of the teleapi.
 * Also, we should set the bot token.
 */
const api = teleapi('telegram_bot_token');

/**
 * And now we can send requests to the Telegram Bot API;
 * This method returns info about the bot to us.
 *
 * (`getMe` method is available in the Telegram Bot API).
 */
api.getMe().then((response) => {
    /** Bot ID */
    console.log('id:', response.id);
    /** and username of the our bot */
    console.log('username:', response.username);

    /**
     * And also first name and last name and lang code.
     * See about it below.
     */
}).catch((error) => {
    /** Something is wrong! */
    console.log(error);
});
```
> If you want to see available methods and types:  
> [Please, have a look at here first.](https://core.telegram.org/bots/api#available-types "Telegram Bot API")


## API
#### `teleapi(token, [api]);`
 * `token:String` - Token of the Bot that you can get from the BotFather
 * `api:Object` - **(optional)** An Object with Custom API(see [api.json](./api.json "Default API"))  
 * Returns: `api` - An instance of the teleapi.

Creates an new instance of the teleapi with your token of the bot.  


#### `teleapi.version:String`
A contain of the current API version.  


#### `teleapi.methods:Array`
A contain an Array of String with all available methods.  


#### `api.getFile(id);`
 * `id:String` - File ID
 * Returns: `Stream` - A stream with file data 

Get file from the Telegram.  


#### `api.method(name, [params]);`
 * `name:String` - Name of the method that available in the Telegram Bot API
 * `params:Object` - **(optional)** An Object with body params for the request
 * Returns: `Promise` with response in `then`

This method send request to the Telegram Bot API;  
It's private method but you can use it.  


#### `api.<method>(params);`
 * `params:Object` - An Object with body params for the request
 * Returns: `Promise` with response in `then`

The `<method>` is one of the available methods from Telegram Bot API.  

> See all available methods [here](https://core.telegram.org/bots/api#available-methods "Telegram Bot API").


## Examples

**Send text message to chat**
```javascript
const teleapi = require('teleapi');

const api = teleapi('telegram_bot_token');

/** Send request with chat and text message */
api.sendMessage({
    chat_id: 0000,
    text: 'Hello!', 
});
```


**Save file from the Telegram**
```javascript
const teleapi = require('teleapi');

const api = teleapi('telegram_bot_token');

/** Send request with file id */
api.getFile('file_id').pipe(fs.createWriteStream('image.png'));
```


**Send sticker(file_id)**
```javascript
const teleapi = require('teleapi');

const api = teleapi('telegram_bot_token');

/** Send request where `sticker` is a file id */
api.sendSticker({
   chat_id: 0000,
   sticker: 'file_id', 
});
```


**Send document(stream.Readable)**
```javascript
const teleapi = require('teleapi');
const fs = require('fs');

const api = teleapi('telegram_bot_token');

/** Send request where `document` is stream.Readable */
api.sendDocument({
   chat_id: 0000,
   document: fs.readFile('book_from_tpb.pdf'), 
});
```


**Send photo(URL)**
```javascript
const teleapi = require('teleapi');

const api = teleapi('telegram_bot_token');

/** Send request where `photo` is an URL */
api.sendPhoto({
   chat_id: 0000,
   photo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Test.png', 
});
```

**Send voice(Buffer)**
```javascript
const teleapi = require('teleapi');

const api = teleapi('telegram_bot_token');

/** Send request where `voice` is a Buffer */
api.sendVoice({
   chat_id: 0000,
   voice: new Buffer([1, 2, 3]), 
});
```


**Send document(strict)**
```javascript
const teleapi = require('teleapi');
const fs = require('fs');

const api = teleapi('telegram_bot_token');

/** Send request where 'document' is an Object with strict data */
api.sendDocument({
    chat_id: 000000,
    document: {
        filename: 'photo.png',
        value: fs.readFile('family_photo.dat'),
        mime: 'image/png',
    },
});
```


> A more is coming soon.


## LICENSE
[MIT](./LICENSE "The MIT License") © [Denis Maslennikov](https://github.com/nof1000 "Author")
