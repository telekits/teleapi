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
 * Checks whether an object is multipart/form-data
 * @private
 *
 * @param  {Object} obj - An object with form-data
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
 * Normalizes an object to sending into body of the request
 * @private
 *
 * @param  {Object} obj - An object with data for sending
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
     * Create an instance of the teleapi
     * @public
     *
     * @param {String} token - Token of the bot
     * @param {Object} custom - An object with Custom API
     */
    constructor(token = '', api = API_DEFAULT) {
        this.version = api.version;
        this.token = token;

        debug.api('version: %s', this.version);

        this.generator(api.methods);
    }

    /**
     * Send the request to Telegram Bot API
     * @private
     *
     * @param  {String} name - Name of the method
     * @param  {Object} params - Body of the request
     * @return {Promise}
     */
    method(name, params = {}) {
        const options = { json: true };
        const form = normalize(params);
        const url = `${API_URL}${this.token}/${name}`;

        if (form.getHeaders) options.headers = form.getHeaders();
        options.body = form;

        return new Promise((resolve, reject) => {
            debug.http('use %s with params: %O', name, params);
            got(url, options).then((res) => {
                debug.http('%s is it responded: %O', name, res.body.result);
                resolve(res.body.result);
            }).catch((error) => {
                let result = error;

                if (error.name === 'HTTPError') {
                    result = new APIError(name, params, error.response.body);
                    debug.error('%s(%s) %s', result.name, result.method, result.message);
                }

                reject(result);
            });
        });
    }

    /**
     * Generates a wrapped methods from an Array of String
     *
     * @param {Array} list - An Array of String with method names
     * @private
     */
    generator(list) {
        list.forEach((item) => {
            debug.api('%s is added', item);
            this[item] = params => this.method(item, params);
        });
    }

    /**
     * Get file from the Telegram Bot API
     * @public
     *
     * @param  {String} id - File ID
     * @return {Stream}
     */
    getFile(id) {
        return got.stream(`${API_FILE + this.token}/${id}`);
    }
}

/** Exports */
module.exports = Object.assign((token, custom) => {
    if (token) return new API(token, custom);
    return API;
}, {
    version: API_DEFAULT.version,
    methods: API_DEFAULT.methods,
});
