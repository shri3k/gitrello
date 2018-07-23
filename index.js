const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');
const handler = require('./lambda').handler;

const app = new Koa();
const route = new Router();

app.use(bodyparser());

route.post('/', async (ctx, next) => {
  const { body } = ctx.request;
  const resp = await handler(body);
  ctx.body = resp;
});

app.use(route.routes());

app.listen('4000');
