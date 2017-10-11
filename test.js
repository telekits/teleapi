/**
 * A contain the testing of teleapi.
 *
 * @author Denis Maslennikov <mrdenniska@gmail.com> (nofach.com)
 * @license MIT
 */

/** Dependencies */
const { randomBytes } = require('crypto');
const teleapi = require('./index.js');
const assert = require('assert');

/** Preparing */
const TOKEN = process.env.TOKEN;
assert.ok(TOKEN, 'The environment must be contain a `TOKEN` variable before you run test.');

/** Testing */
describe('Exports', () => {
    it('should be as a Function', () => {
        assert.equal(Object.getPrototypeOf(teleapi), Function.prototype);
    });

    it('should be contained a `version` variable', () => {
        assert.ok(teleapi.version);
    });

    it('should be contained a `methods` variable', () => {
        assert.ok(teleapi.methods);
    });
});

describe('Instance', () => {
    it('should return new instance', () => {
        const api = teleapi(TOKEN);

        assert.ok(api);
    });

    it('should return new instance with custom api', () => {
        const methodName = 'getMe';
        const version = '1.0-custom';
        const api = teleapi(TOKEN, {
            version: '1.0-custom',
            methods: [methodName],
        });

        assert.ok(api);

        assert.equal(api.version, version);
        assert.ok(api.getMe);
    });
});

describe('API', () => {
    it('should request to sendMessage without params and get throw an error', (done) => {
        const api = teleapi(TOKEN);

        api.sendMessage()
            .then(() => done(new Error("Request wasn't to pass")))
            .catch(() => done());
    });

    it('should request to random method without params and get throw an error', (done) => {
        const method = `random-${randomBytes(16).toString('hex')}`;
        const api = teleapi(TOKEN);

        api.method(method)
            .then(() => done(new Error("Request wasn't to pass")))
            .catch(() => done());
    });

    it('should be received an information about the bot', (done) => {
        const api = teleapi(TOKEN);

        api.getMe().
            then((response) => {
                assert.ok(response.id);
                assert.ok(response.is_bot);
                assert.ok(response.username);
                done();
            });
    });
});
