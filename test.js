/** Dependencies */
const teleapi = require('./index.js');
const test = require('ava');

/** Token for testing */
const token = process.env.TOKEN;

/** Tests */
test.before('`Token` should be is defined!', (t) => {
    t.truthy(token, '`token` is defined.');
});

test('Should be created a new instance', (t) => {
    const api = teleapi(token);
    t.truthy(api, 'is created!');
});

test('Should be created a custom methods', (t) => {
    const api = teleapi(token, {
        version: '1.0-custom',
        methods: [
            'getMe',
        ],
    });

    t.truthy(api.getMe, 'is created!');
});

test('Should be an error', (t) => {
    const api = teleapi(token);
    return api.sendMessage().then((data) => {
        t.fail();
    }).catch((error) => {
        t.pass();
    });
});

test('Should get information about bot', (t) => {
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


