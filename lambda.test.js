const lambda = require('./lambda').handler;
const test = require('ava');
const prWrongTitle = require('./fixtures/prRightTitle');
const prRightTitle = require('./fixtures/prWrongTitle');

test('Webhook: PR request with wrong title', async t => {
  t.deepEqual(
    {
      msg: 'Wrong title format',
    },
    await lambda(prWrongTitle),
  );
});

test('Webhook: PR request with right title', async t => {
  t.deepEqual(
    {
      msg: 'Something went wrong',
    },
    await lambda(prRightTitle),
  );
});
