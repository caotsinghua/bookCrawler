const Koa = require('koa')
const BodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const indexRouter = require('./routers/index')

const app = new Koa();
app.use(cors({
	origin: function(ctx) {
		return '*';
	}
}));
app.use(BodyParser());
app.use(indexRouter.routes()).use(indexRouter.allowedMethods());

app.listen('8083', (e) => {
	if (e) {
		console.error(e.message)
	} else {
		console.log('[bookCrawlerServer] listen on 8083');
	}

})