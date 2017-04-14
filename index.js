/**
 * The useful library to simplify your work with Telegram Bot API
 *
 * @module telekit
 * @author Denis Maslennikov <mrdenniska@gmail.com> (nofach.com)
 * @license MIT
 */

/** Dependencies */
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

/**
 * Available API Methods
 * @private
 */
const API_DEFAULT = require('./api.json');

/**
 * Methods
 * @private
 */

/**
 * Checks whether an Object is multipart/form-data
 * @private
 *
 * @param  {Object} obj
 * @return {Boolean}
 */
function isFormData(obj) {
    return Object.keys(obj).some((key) => {
        if (obj[key] instanceof stream.Stream) return true;
        if (Buffer.isBuffer(obj[key])) return true;
        return false;
    });
}

/**
 * Normalize Object to sending in body
 * @private
 *
 * @param  {Object} obj
 * @return {Object|form-data}
 */
function normalize(obj) {
    const isMultipart = isFormData(obj);
    const content = { filename: '', value: '', mime: '' };
    const result = ((isMultipart) ? new FormData() : {});
    let file = null;

    Object.keys(obj).forEach((item) => {
        if (isMultipart) {
            if (obj[item].value) content.value = obj[item].value;
            else content.value = obj[item];

            content.filename = obj[item].filename || null;
            content.mime = obj[item].mime || null;

            if (content.value instanceof stream.Stream) {
                result.append(item, content.value, {
                    contentType: content.mime,
                    filename: content.filename,
                });

                return;
            }

            if (Buffer.isBuffer(content.value)) {
                file = FileType(content.value);
                result.append(item, content.value, {
                    contentType: content.mime || file.mime || 'application/octet-stream',
                    filename: content.filename || `data-${Date.now()}.${file.ext || ''}`,
                });

                return;
            }

            if (typeof content.value === 'object') {
                result.append(item, JSON.stringify(content.value), {
                    contentType: 'application/json',
                });

                return;
            }

            result.append(item, content.value);
        } else {
            if (typeof obj[item] === 'object') {
                result[item] = JSON.stringify(obj[item]);
                return;
            }

            result[item] = obj[item];
        }
    });

    return result;
}

/**
 * Implementation
 * @public
 */
class API {
    /**
     * Create a new telekit
     * @public
     *
     * @param  {String} token - Token of Tekegran Bot API
     * @param  {Object} custom - Custom API
     */
    constructor(token = '', api = API_DEFAULT) {
        this.version = api.version;
        this.token = token;

        debug(`version: ${api.version}`);

        this.generator(api.methods);
    }

    /**
     * Send request to Telegram Bot API
     * @private
     *
     * @param  {String} method - method name
     * @param  {Object} params - body in request
     * @param  {Function} callback - (error, response)=>{...}
     * @return {Promise}
     */
    method(method, params = {}, callback = null) {
        let options = {};
        let form = null;
        const url = `${API_URL}${this.token}/${method}`;

        form = normalize(params);
        options = { body: form, json: true };

        if (form.getHeaders) {
            debug('multipart/form-data');
            options.headers = form.getHeaders();
        }

        return new Promise((resolve, reject) => {
            got(url, options).then((res) => {
                const error = (res.body.ok) ? null : new Error(res.body.description);

                debug('response: %O', res.body.result);

                if (callback) callback(error, res.body.result);

                if (error) reject(error);
                else resolve(res.body.result);
            }).catch((error) => {
                debug(`error ${error.message}`);

                if (callback) callback(error, null);
                reject(error);
            });
        });
    }

    /**
     * The generate bound methods from `String` Array
     *
     * @param {Array} list - string array of methods
     * @private
     */
    generator(list) {
        list.forEach((item) => {
            debug(`generate ${item}`);
            this[item] = (params, callback) => this.method(item, params, callback);
        });
    }

    /**
     * Get file from Telegram Bot API
     * @public
     *
     * @param  {String} id - file id
     * @return {Stream}
     */
    getFile(id) {
        return got.stream(`${API_FILE + this.token}/${id}`);
    }
}

/** Exports */
module.exports = (token, custom) => {
    if (token) return new API(token, custom);
    return API;
};
