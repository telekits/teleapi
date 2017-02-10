/** Dependencies */
const teleapi = require('./index.js');
const test = require('ava');

/** Token for testing */
const token = process.env.TOKEN;

/** Tests */
test.before('`TOKEN` must be is defined!', (t) => {
    t.truthy(token);
});

test('Should be created a new instance', (t) => {
    const api = teleapi(token);
    t.truthy(api);
});

test('Should be created a new instance with custom methods', (t) => {
    const api = teleapi(token, {
        version: '1.0-custom',
        methods: [
            'getMe',
        ],
    });

    t.truthy(api.getMe);
});

test('Should throw an error', (t) => {
    const api = teleapi(token);
    return api.sendMessage().then((data) => {
        t.fail();
    }).catch((error) => {
        t.pass();
    });
});

test('Should get description of bot', (t) => {
    const api = teleapi(token);
    return api.getMe().then((data) => {
        if (data.id && data.first_name && data.username) {
            t.pass();
        } else {
            t.fail();
        }
    }).catch((error) => {
        t.fail();
    });
});


