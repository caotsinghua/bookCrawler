const Router=require('koa-router')
const {searchBook,getBookList,getBookContent} =require('../bookCrawler/index')
const bookRouter=new Router();
bookRouter.get('/search',async ctx=>{
  // params:searchKey
  let {searchKey}=ctx.request.query;
  ctx.body=await searchBook(searchKey);
}).get('/:bookId',async ctx=>{
  let {bookId}=ctx.params;
  ctx.body=await getBookList(bookId);
}).get('/:bookId/:chapterId',async ctx=>{
  let {bookId,chapterId}=ctx.params;
  ctx.body=await getBookContent(bookId,chapterId);
})
module.exports=bookRouter;