/** Dependencies */
const teleapi = require('./index.js');
const test = require('ava');

/** Token for testing */
const token = process.env.TOKEN;

/** Tests */
test.before('`TOKEN` must be is defined in ENV!', (t) => {
    t.truthy(token);
});

test('Should be created new an instance of the teleapi', (t) => {
    const api = teleapi(token);
    t.truthy(api);
});

test('Should be created new an instance of the teleapi with custom api', (t) => {
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

test('Should get description of the bot', (t) => {
    const api = teleapi(token);
    return api.getMe().then((data) => {
        if (data.id && data.username) {
            t.pass();
        } else {
            t.fail();
        }
    }).catch((error) => {
        t.fail();
    });
});


