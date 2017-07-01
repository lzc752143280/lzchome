/**
 * Created by Lzc on 2017/4/11.
 */
var i = 0;
var flag = true;
var imgs = $(".banner img");
var imgH = $(".banner img:first").height();//获取img高度
var imgW = $(".banner img:first").width();//获取img宽度
$(".banner").css("height",imgH+"px");
$(".banner").css("width",imgW+"px");
for(var l=0;l<imgs.length;l++)//生成图片数量对应的li
{
    $(".ctrl ul").append("<li>"+(l+1)+"</li>");
}
$(".ctrl li:first").attr("class","current");//当前li
$(".box").bind({
    mouseover:function(){
        $(".prev,.next").css("display","block");//箭头显示
        window.clearInterval(jsq);//计时器停止
    },
    mouseout:function(){
        $(".prev,.next").css("display","none");//箭头隐藏
        window.clearInterval(jsq);
        jsq = window.setInterval("nextOne()",4000);//计时器开始
    }
});
$(".prev").click(//上一张
    function(){
        if(flag == true)
        {
            $(".banner img:eq("+i+")").animate({left:imgW},1000);//当前图片向右滑出屏幕
            --i < 0 ?  i = imgs.length - 1 : i;
            $(".banner img:eq("+i+")").css({left:-imgW+"px",display:"block"});//上一张图片显示并快速移动到屏幕外左侧
            $(".banner img:eq("+i+")").animate({left:0},1000);//上一张图片滑动到屏幕中间
            changeli();
            flag = false;
            window.setTimeout("flag = true",1000);//控制点击间隔
        }
    }
);
$(".next").click(//下一张
    function() {
        if(flag == true)
        {
            nextOne();
            flag = false;
            window.setTimeout("flag = true",1000);//控制点击间隔
        }

    }
);
function nextOne()//下一张的函数
{
    $(".banner img:eq(" + i + ")").animate({left: -imgW}, 1000);//当前图片向左滑出屏幕
    ++i > imgs.length - 1 ? i = 0 : i;
    $(".banner img:eq(" + i + ")").css({left: imgW + "px", display: "block"});//下一张图片显示并快速移动到屏幕外右侧
    $(".banner img:eq(" + i + ")").animate({left: 0}, 1000);//下一张图片滑动到屏幕中间
    changeli();
}
function changeli(){//li样式跟随
    $(".ctrl li").attr("class","");
    $(".ctrl li:eq("+i+")").attr("class","current");
}
var jsq;
window.onload = function(){
    jsq = window.setInterval("nextOne()",4000);//自动播放
}
$(".ctrl li").click(function(){
    var iclick = $(".ctrl li").index(this);
    if(iclick > i)
    {
        $(".banner img:eq(" + i + ")").animate({left: -imgW}, 1000);//当前图片向左滑出屏幕
        $(".banner img:eq(" + iclick + ")").css({left: imgW + "px", display: "block"});//选中图片显示并快速移动到屏幕外右侧
    }else if(iclick < i)
    {
        $(".banner img:eq("+i+")").animate({left:imgW},1000);//当前图片向右滑出屏幕
        $(".banner img:eq("+iclick+")").css({left:-imgW+"px",display:"block"});//选中图片显示并快速移动到屏幕外左侧
    }else return;
    $(".banner img:eq(" + iclick + ")").animate({left: 0}, 1000);//选中图片滑动到屏幕中间
    i = iclick;
    changeli();
});