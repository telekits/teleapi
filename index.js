/**
 * The useful library to simplify your work with Telegram Bot API
 *
 * @author Denis Maslennikov <mrdenniska@gmail.com> (http://nofach.com/)
 * @license MIT
 */

const FormData = require('form-data');
const FileType = require('file-type');
const stream = require('stream');
const debug = require('debug')('teleapi');
const got = require('got');

/**
 * Variables
 * @private
 */
const API_FILE = 'https://api.telegram.org/file/bot';
const API_URL = 'https://api.telegram.org/bot';

/** Available API Methods */
const api = require('./api.json');

/**
 * Methods
 * @private
 */

/**
 * Checks whether an Object is multipart/form-data
 *
 * @param  {Object} obj
 * @return {Boolean}
 * @private
 */
function isFormData(obj) {
    for (let item in obj) {
        if (obj.hasOwnProperty(item)) {
            if (obj[item] instanceof stream.Stream) return true;
            else if (Buffer.isBuffer(obj[item])) return true;
        }
    }

    return false;
}

/**
 * Normalize Object to sending in body
 *
 * @param  {Object} obj
 * @return {Object|form-data}
 * @private
 */
function normalize(obj) {
    let isMultipart = isFormData(obj);
    let content = { filename: '', value: '', mime: '' };
    let result = isMultipart ? new FormData() : {};
    let file = null;

    for (let item in obj) {
        if (obj.hasOwnProperty(item)) {
            if (isMultipart) {
                if (obj[item].value) content.value = obj[item].value;
                else content.value = obj[item];

                content.filename = obj[item].filename || null;
                content.mime = obj[item].mime || null;

                if (content.value instanceof stream.Stream) {
                    result.append(item, content.value, {
                        contentType: content.mime,
                        filename: content.filename
                    });
                    continue;
                }

                if (Buffer.isBuffer(content.value)) {
                    file = FileType(content.value);
                    result.append(item, content.value, {
                        contentType: content.mime || file.mime || 'application/octet-stream',
                        filename: content.filename || `data-${(new Date()).getTime()}.${file.ext || ''}`
                    });
                    continue;
                }

                if (typeof(content.value) == 'object') {
                    result.append(item, JSON.stringify(content.value), {
                        contentType: 'application/json'
                    });
                    continue;
                }

                result.append(item, content.value);
            } else {
                if (typeof(obj[item]) == 'object') {
                    result[item] = JSON.stringify(obj[item]);
                    continue;
                }

                result[item] = obj[item];
            }
        }
    }

    return result;
}

/**
 * This class is a wrapper over telegram api
 * @public
 */
class API {
    /**
     * Create a wrapper
     *
     * @param {String} token - Bot token
     */
    constructor(token = '') {
        this.token = token;
        this.version = api.version;

        debug(`version: ${api.version}`);

        this.generator(api.methods);
    }

    /**
     * Send request to Telegram Bot API
     *
     * @param {String} method
     * @param {Object} params - body in request
     * @param {Function} callback - (error, response)=>{...}
     * @return {Promise} Promise
     * @private
     */
    method(method, params = {}, callback = null) {
        let options = {};
        let form = null;
        let url = `${API_URL}${this.token}/${method}`;

        form = normalize(params);
        options = { body: form, json: true };

        if (form.getHeaders) {
            debug('multipart/form-data');
            options.headers = form.getHeaders();
        }

        return new Promise((resolve, reject) => {
            got(url, options).then(res => {
                let err = (res.body.ok) ? null : new Error(res.body.description);

                debug('response: %o', res.body);

                if (callback) callback(err, res.body);
                (err) ? reject(err) : resolve(res.body);
            }).catch(error => {
                debug(`error ${error.message}`);

                if (callback) callback(error, null);
                reject(error);
            });
        });
    }

    /**
     * The generate bound methods from String Array
     *
     * @param {Array} list - string array of methods
     * @private
     */
    generator(list) {
        list.forEach(item => {
            debug(`generate ${item}`);
            this[item] = (params, callback) => {
                return this.method(item, params, callback);
            }
        });
    }

    /**
     * Get file from Telegram
     *
     * @param {String} id - file id
     * @return {Stream}
     * @public
     */
    getFile(id) {
        return got.stream(`${API_FILE + this.token}/${id}`);
    }
}

module.exports = (token) => {
    if (token) return new API(token);
    return API;
}
