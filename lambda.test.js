const lambda = require('./lambda').handler;
const test = require('ava');
const prWrongTitle = require('./fixtures/prWrongTitle');
const prRightTitle = require('./fixtures/prRightTitle');

test('Webhook: PR request with wrong title', async t => {
  t.deepEqual(
    {
      msg: 'Wrong title format',
    },
    await lambda(prWrongTitle),
  );
});

test('Webhook: PR request with right title but failed', async t => {
  t.deepEqual(
    {
      msg: 'Something went wrong',
    },
    await lambda(prRightTitle),
  );
});
