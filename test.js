/** Dependencies */
const { randomBytes } = require('crypto');
const teleapi = require('./index.js');
const test = require('ava');

/** Token for testing */
const token = process.env.TOKEN;

/** Tests */
test.before('`TOKEN` must be is defined in ENV!', (t) => {
    t.truthy(token);
});

test('Checking presence of the default methods and api version', (t) => {
    t.truthy(teleapi.methods);
    t.truthy(teleapi.version);
});

test('Just trying to create new instance', (t) => {
    const api = teleapi(token);

    t.truthy(api);
});

test('Trying to create new instance with custom api', (t) => {
    const api = teleapi(token, {
        version: '1.0-custom',
        methods: ['getMe'],
    });

    t.truthy(api.getMe);
});

test('Request to sendMessage without params', (t) => {
    const api = teleapi(token);

    api.sendMessage()
        .then(() => t.fail())
        .catch(() => t.pass());
});

test('Request to random method without params', (t) => {
    const method = `random-${randomBytes(16).toString('hex')}`;
    const api = teleapi(token);

    api.method(method)
        .then(() => t.fail())
        .catch(() => t.pass());
});

test('Get the description of the bot', (t) => {
    const api = teleapi(token);

    api.getMe()
        .then((data) => (data.id && data.username) ? t.pass() : t.fail())
        .catch((error) => t.fail());
});


