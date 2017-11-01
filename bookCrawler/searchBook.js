const phantom=require('phantom');
const cheerio=require('cheerio');
const apis=require('./config').apis;
// 返回格式
let responseJson={
  success:'',
  'num':0,// 条目数量,
  'result':[{
    'title':'title',//书标题,
    'author':'',//书作者,
    'id':'',//书id
    'updateTime':'',//更新时间
  }]//搜索结果
}
/**
 * 搜索书籍 
 * @param {String} searchKey 
 */
async function searchBook(searchKey){
  const instance=await phantom.create();
  
  const page=await instance.createPage();
  await page.setting('loadImages',false); //禁止加载图片
  const startTime=new Date();
 
  
  let key=encodeURIComponent(searchKey);
  console.log(`${apis.searchApi}${key}`)
  const status=await page.open(`${apis.searchApi}${key}`);
  if(status!='success'){
    console.error('获取信息错误 line12 状态'+status);
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
  let list=$('#hotcontent>.grid>tbody tr').toArray();
  list.shift();
  let result=[];
  await list.forEach(function(item){
    let a=$(item).find('td.odd').first().find('a').attr('href');
    let a_array=a.split('/');
    a_array.pop();
    let id=a_array.pop();
    
    result.push({
      'title':$(item).find('td.odd').first().text(),
      'author':$(item).find('td.odd').eq(1).text(),
      'updateTime':$(item).find('td.odd').last().text(),
      id
    })
  })
  responseJson.num=result.length;
  responseJson.result=result;
  responseJson.success=true;
  
  console.info('[time:]',((new Date())-startTime)/1000+'s');
  await instance.exit();
  return responseJson;// 返回搜索结果 
}

  // searchBook('圣墟').then(res=>{
  //   console.log(res);
  // }).catch(e=>{
  //   console.log(e.message)
  // })
module.exports=searchBook;