const Router=require('koa-router')
const bookRouter=require('./bookRouter')
const index=new Router();
index.use('/api/book',bookRouter.routes(),bookRouter.allowedMethods());
module.exports=index;