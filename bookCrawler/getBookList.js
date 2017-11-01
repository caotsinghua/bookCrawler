const phantom=require('phantom');
const cheerio=require('cheerio');
const apis=require('./config').apis;
// 返回格式
let responseJson={
  success:'',
  num:0,// 条目数量,
  bookId:'',
  bookName:'',
  author:'',
  chapters:[{
    title:'',
    id:''
  }]
}
/**
 * 获取章节列表 
 * @param {String} bookId 
 */
async function getList(bookId){
  const instance=await phantom.create();
  
  const page=await instance.createPage();
  await page.setting('loadImages',false); //禁止加载图片
  const startTime=new Date();
 
  
  
  console.log(`${apis.bookListApi}${bookId}`)
  const status=await page.open(`${apis.bookListApi}${bookId}`);
  if(status!='success'){
    console.error('获取信息错误 line27 状态'+status);
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
  let dd_list=$('#list dd>a').toArray();
  let chapters=[];
  await dd_list.forEach(function(item){
    let a_array=$(item).attr('href').split('/');
    let href=a_array.pop();
    let id=href.substring(0,href.indexOf('.'));
    let title=$(item).text();
    chapters.push({title,id})
  })
  let bookName=$('.box_con>#maininfo>#info>h1').text();
  let author=$('.box_con>#maininfo>#info>h1').next().text().substring(7);
  let poster=$('#fmimg>img').attr('src');
  responseJson={
    success:true,num:chapters.length,bookId,author,bookName,chapters,poster
  }
  console.info('[time:]',((new Date())-startTime)/1000+'s');
  await instance.exit();
  return responseJson;// 返回搜索结果 
}

// getList('52_52542').then(res=>{
//   console.log(res)
// });
module.exports=getList;