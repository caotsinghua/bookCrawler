const phantom=require('phantom');
const cheerio=require('cheerio');
const apis=require('./config').apis;
// 返回格式
let responseJson={
  success:'',
  title:'',
  id:'',
  content:''
}
/**
 * 获取章节详情
 * @param {String} bookId 
 * @param {String} chapterId 
 */
async function getContent(bookId,chapterId){
  const instance=await phantom.create();
  
  const page=await instance.createPage();
  await page.setting('loadImages',false); //禁止加载图片
  const startTime=new Date();
 
  
  const api=`${apis.bookChapterApi}${bookId}/${chapterId}.html`
  console.log(api)
  const status=await page.open(api);
  if(status!='success'){
    console.error('获取信息错误 line33 状态'+status);
    await instance.exit();
    return {
      success:false,
      message:'请求出错'
    }
  }
  const htmlContent=await page.property('content');
  // 将搜索结果进行筛选
  const $=cheerio.load(htmlContent,{decodeEntities: false});
  //关闭实体转换，解决中文乱码问题 
  let content=$("#content").html();
  let c=content.replace(/\<br\>/g,'\n')
  let title=$(".bookname>h1").text();
  responseJson={
    success:true,content:c,title,id:chapterId
  }
  console.log(responseJson)
  console.info('[time:]',((new Date())-startTime)/1000+'s');
  await instance.exit();
  return responseJson;// 返回搜索结果 
}

// getContent('52_52542','149693001');
module.exports=getContent;