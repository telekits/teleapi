var request = require('request');

/*  @class
 *  Telegram Bot API wrapper
 *
 *  @param {String} Bot Auth Token
 *  @constructor
**/
var API = function(token) {
    this._uApi = 'https://api.telegram.org/bot';
    this.token = token || "";
}

/*
 *  Method for sending GET and POST requests on Telegram Bot API
 *
 *  @param {String} method name for calling from API
 *  @param {Object} POST Data
 *  @param {Function} callback:
        @param {Boolean} if there are any errors becomes true
        @param {Object} JSON Object from request
 *  @return {Object#API} this
**/
API.prototype.method = function(method, params, callback) {
    if (this.token == "") throw "Token is missing!";
    var isPost = ((typeof params != 'function') ? true : false),
        isFormData = ((isPost) ? this._isFormData(params) : false),
        _callback = ((isPost) ? callback : params);
    request({
        "method": isPost ? 'POST' : 'GET',
        "url": this._uApi + this.token + '/' + method,
        "form": ((isPost && !isFormData) ? params : null),
        "formData": ((isFormData) ? params : null),
        "json": true
    }, function(err, res, body){
        if (!err && res.statusCode == 200 && body.ok) {
            if (_callback) _callback(false, body.result);
            return;
        }
        if (_callback) _callback(true, {
            "error": err || true,
            "code": body.error_code || res.statusCode || null, 
            "info": body.description || null
        });
    });
    return this;
};

/*  @private
 *  Verification of the existence of objects in the object
 *
 *  @param {Object} the object for verification
 *  @return {Boolean} if there is objects within the object to return true
**/
API.prototype._isFormData = function(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] == 'object') return true;
        }
    }
    return false;
};

// Drops a wrapper for API methods
(function(obj){
    ['getMe','getUpdates','setWebhook',
    'sendMessage','forwardMessage','sendPhoto',
    'sendAudio','sendDocument','sendSticker',
    'sendVideo','sendLocation','sendChatAction',
    'getUserProfilePhotos'].forEach(function(item){
        obj.prototype[item] = (function(params, callback){
            var isPost = ((typeof params != 'function') ? true : false),
                _params = (isPost ? params : null),
                _callback = (isPost ? callback : params),
                method = item;
            this.method(method, _params, _callback);
            return this;
        });
    });
})(API);

module.exports = API;