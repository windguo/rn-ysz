/**
 * Created by zhangzuohua on 2018/1/22.
 */

export default urlConfig = {
    //  baseURL: 'http://jianjie.92kaifa.com',
   // baseURL: 'http://www.jianjie8.com',
    //举报URL
    ReportURL: 'http://m.jianjie8.com/report',
    // 收藏url
    FavasURL: 'http://m.jianjie8.com/fava',
    agreementURL: 'http://m.jianjie8.com/agreementBiaoqing',
    suggestURL: "http://www.jianjie8.com/e/tool/feedback/?bid=1",
    //最新更新
    //  newList: '/e/api/?getJson=new',
    // // 随机穿越
    //  randomList: '/e/api/?getJson=rand',
    //待处理
    //栏目列表 http://jianjie.92kaifa.com/e/api/getNewsClass.php
    // sectionList:'/e/api/?getJson=class',
    sectionList:'/e/api/biaoqing?getJson=class',
//随机
    sectionListRand:'/e/api/biaoqing/?getJson=column&classid=183',
    //栏目列表数据后面拼接&classid=3
    // sectionListData:'/e/api/?getJson=column',
    sectionListData:'/e/api/biaoqing?getJson=column',
//随机
    sectionListDataRand:'/e/api/biaoqing?getJson=column',
    // 表情包
    sectionListDataBiaoqingbao:'/e/api/biaoqing?getJson=column',
    //发布地址
    pubLishUrl:'http://m.jianjie8.com/fromapp',
    //点赞或者踩 {classid:2,id:2,dotop:1,doajax:1,ajaxarea:'diggnum'dotop这个字段 传0 是踩踩 传1是赞}
    thumbUpUrl:'/e/public/digg/post/index.php',
    thumbDownUrl:'/e/public/digg/post/diggbot.php',
    LoginUrl:  '/e/member/doaction.php',
    // 我发布的内容
    MyPublishUrl:  '/e/api/biaoqing?getJson=article',
    // 我收藏的内容
    MyFavasUrl: '/e/api/biaoqing/?getJson=favas',
    userInfo: '/e/api/biaoqing?getJson=article',
    //更新检测地址
    CheckUpdate:"/e/api/biaoqing?getJson=version",
    //分享出去的图片
    thumbImage: 'http://jianjie8.com/skin/h8/images/icon_share.png',
    //复制完跳去详情
     DetailUrl: "http://m.jianjie8.com/detail/",
    Search:'/e/api/biaoqing/?classid=72&getJson=',
     DetailUrl:'/e/api/biaoqing/?getJson=content',
    TouxiangDetailUrl:'/e/api/biaoqing/?getJson=TouxiangContent',
    sectionListTouxiangClass: '/e/api/biaoqing?getJson=touxiangClass',
    sectionListDataTouxiang: '/e/api/biaoqing?getJson=touxiangColumn',

    CheckCommitTips: '/e/api/biaoqing/?getJson=commitTips'

}

