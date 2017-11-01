# bookCrawler
一个获取笔趣阁书籍的简单爬虫

使用nodejs（phantomjs和cheerio）。
phantomjs就是一个没有界面的浏览器，获取到js运行之后的静态页面（js不能出错），使用cheerio进行dom操作，过滤出自己想要的数据。

只写了搜索，获取书籍信息和目录，获取章节内容的接口。
代码在bookCrawler文件夹中。
