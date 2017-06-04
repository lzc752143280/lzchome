/**
 * Created by Lzc on 2017/5/20.
 */
$sidebar = $("#sidebar");
$content = $("#content");
$mask = $("#content > div");
$nav = $("#nav");
$navMenuBtn = $("#nav .menu");
$navMenu = $("#nav ul li");
$main = $("#main");
var list = ["home","skill","document","communion","about"];
//展开侧边栏
function openSidebar(){
    $nav.animate({width:"200px"},300);
    $content.animate({marginLeft:"200px"},300);
    //$mask.show().animate({opacity:0.7},300);
    //$mask.attr("class","mask");
    var add = 0;
    var alphaAdd_jsq = setInterval(function ()
    {
        add+=0.1;
        $mask.css({backgroundColor: "rgba(0,0,0,"+ add +")"});
        add >= 0.3?clearInterval(alphaAdd_jsq):add;
    },50);
    $navMenuBtn.animate({
        width:30,
        height:30
    },300);
    if($nav.width() < 200)
    {
        var i = 0;
        var revolveBlock = setInterval(function ()
        {
            i--;
            if(i < -45)
            {
                i = -45;
                clearInterval(revolveBlock);
            }
            $navMenuBtn.css({transform:"rotate("+ i +"deg)"});
        },300/45)
    }
}

//收起侧边栏
function closeSidebar(event){
    event.stopPropagation();
    $nav.animate({width:"40px"},300);
    $content.animate({marginLeft:"40px"},300);
    //$mask.animate({opacity:0},300);
    //$mask.attr("class","");
    var reduce = 0.3;
    var alphaReduce_jsq = setInterval(function ()
    {
        reduce -= 0.1;
        $mask.css({backgroundColor: "rgba(0,0,0,"+ reduce +")"});
        reduce < 0?clearInterval(alphaReduce_jsq):reduce;
    },50);
    $navMenuBtn.animate({
        width:22,
        height:22
    },300);
    if($nav.width() > 40)
    {
        var i = -45;
        var revolveBlock = setInterval(function ()
        {
            i++;
            if(i > 0)
            {
                i = 0;
                clearInterval(revolveBlock);
            }
            $navMenuBtn.css({transform:"rotate("+ i +"deg)"});
        },300/45);
    }
}

//侧边栏点击事件
$sidebar.on("click",openSidebar);
$content.on("click",function (event)
{
    if($nav.width() > 40){
        closeSidebar(event);
    }
});
$navMenuBtn.on("click",function (event)
{
    if($nav.width() > 40)
    {
        closeSidebar(event);
    }
});

//导航菜单动画
$navMenu.on("click",function(event){
    var $that = $(this);
    $navMenu.children().removeClass("active");
    $that.siblings().animate({paddingLeft:0},200);
    $that.animate({paddingLeft:10},200);
    $that.children("a").addClass("active");
    /*setTimeout(function ()
     {
     closeSidebar(event);
     },1000);*/
});

/*//禁止F5刷新
$(document).ready(function() {
     $(document).bind("keydown", function(e)
     {
         e = window.event || e;
         if (e.keyCode == 116)
         {
             e.keyCode = 0;
             return false;
         }
     });
 });*/
//首先加载一次首页
$.ajax({
    type:"get",
    url:"home.html",
    dateType:"text",
    success:function (txt)
    {
        $main.html(txt).hide().fadeIn(1000);
    },
    error:function ()
    {
        console.log("错误");
    }
})
//给a标签绑定pjax事件
$sidebar.pjax('a','#main',{timeout:3000});
//入场动画

$(document).on("pjax:success",function(options, data, status, xhr){
    //data:返回的内容
    //status:状态(如:success)
    //xhr:XMLHttpRequest对象
    //contents:返回的jquery对象
    $main.hide().fadeIn(1000);
    /*var chList = ["首页","雕虫小技","IE那些事","吐槽本站","个人资料"];
    var url = window.location.pathname;
    for(var i = 0; i < list.length; i++)
    {
        if(url.indexOf(list[i]) != -1)
            $("title").text(chList[i]);
    }*/
})

//导航栏跟随前进后退事件变化
window.onpopstate = function()
{
    setTimeout(function ()
    {
        var title = $main.children().attr("class");
        for(var i in list)
        {
            if(list[i] == title)
            {
                $navMenu.children().removeClass("active");
                $navMenu.eq(i).siblings().animate({paddingLeft:0},200);
                $navMenu.eq(i).animate({paddingLeft:10},200);
                $navMenu.eq(i).children("a").addClass("active");
            }
        }
    },100);
}
/*
//ajax插件(支持histroy功能)
$.pjax({
    selector: 'a',
    container: '#main', //内容替换的容器
    show: 'fade',  //展现的动画，支持默认和fade, 可以自定义动画方式，这里为自定义的function即可。
    cache: false,  //是否使用缓存
    storage: false,  //是否使用本地存储
    titleSuffix: "", //标题后缀
    filter: function(){},
    callback: function(status){
        var type = status.type;
        switch(type){
            case 'success':
                //$("title").text($(this).data("name"));//修改title
                $('<link rel="stylesheet" href="css/'+ $(this).data("url") +'.css">').appendTo($("head"));//动态添加CSS
                break;//正常
            case 'cache':;break; //读取缓存
            case 'error': ;break; //发生异常
            case 'hash': ;break; //只是hash变化
        }
    }
})
*/


 /*function getQueryString(name)
 {
 var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
 var r = window.location.search.substr(1).match(reg);
 if(r!=null)return  unescape(r[2]); return null;
 }*/
/*function getPage(target)
{
    /*var list = {
           home:"主页",
           skill:"雕虫小技",
           document:"IE那些事",
           communion:"吐槽本站",
           about:"个人资料"
       };
       $.ajax({
           type:"GET",
           url:target+".html",
           dateType:"html",
           success:function (html)
           {
               //console.log(html);
               $main.html(html);//修改页面内容
               history.pushState("","","index.html?page="+target);//添加历史记录
               $('<link rel="stylesheet" href="css/'+ target +'.css">').appendTo($("head"));//动态添加CSS
               $("title").text(list[target]);//动态修改标题
           },
           error:function ()
           {
               alert("错误");
           }
       })
}*/
