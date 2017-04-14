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
const debug = require('debug');
const got = require('got');

/** Debug */
debug.error = debug('teleapi:error');
debug.error.color = 1;

debug.http = debug('teleapi:api');
debug.http.color = 2;

debug.api = debug('teleapi:api');
debug.api.color = 3;

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
 * Custom Errors
 * @public
 */
class APIError extends Error {
    constructor(method, params, response) {
        super();

        this.name = 'APIError';
        this.method = method;
        this.params = params;

        this.message = response.description;
        this.timeout = response.retry_after || null;
        this.migrate = response.migrate_to_chat_id || null;
        this.code = response.error_code;
    }
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

        debug.api('version: %s', this.version);

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
        const options = { json: true };
        const form = normalize(params);
        const url = `${API_URL}${this.token}/${method}`;

        if (form.getHeaders) options.headers = form.getHeaders();
        options.body = form;

        return new Promise((resolve, reject) => {
            debug.http('use %s with params: %O', method, params);
            got(url, options).then((res) => {
                debug.http('%s is it responded: %O', method, res.body.result);

                if (callback) callback(null, res.body.result);
                else resolve(res.body.result);
            }).catch((error) => {
                let result = error;

                if (error.name === 'HTTPError') {
                    result = new APIError(method, params, error.response.body);
                    debug.error('%s(%s) %s', result.name, result.method, result.message);
                }

                if (callback) callback(result, null);
                else reject(result);
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
            debug.api('%s is added', item);
            this[item] = (params, callback) => {
                const result = this.method(item, params, callback);
                return result;
            };
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
