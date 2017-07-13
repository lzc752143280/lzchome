/**
 * Created by Lzc on 2017/5/28.
 */
//获取浏览器信息
function AppInfo()// 浏览器类型版本判断
{
    var browser = {appname: 'unknown', version: 0},
        userAgent = window.navigator.userAgent.toLowerCase();  // 使用navigator.userAgent来判断浏览器类型
    if (/(msie|firefox|opera|chrome)\D+(\d[\d.]*)/.test(userAgent))
    {
        browser.appname = RegExp.$1;
        browser.version = RegExp.$2;
    } else if (/version\D+(\d[\d.]*).*safari/.test(userAgent))
    {
        browser.appname = 'safari';
        browser.version = RegExp.$2;
    }
    return browser;//返回浏览器信息对象
}

//自适应缩放实现
function SelfAdaption(dom)
{
    var r = (document.body.offsetHeight + document.body.offsetWidth) / 2500;//计算缩放比例
    r > 1 ? r = 1 : r;
    dom.style.WebkitTransform = "scale(" + r + ")";
    dom.style.msTransform = "scale(" + r + ")";
    dom.style.transform = "scale(" + r + ")";
}
//JQuery不支持的动画,依赖JQuery实现
function JqueryUnsupportedAnimation()
{
}
JqueryUnsupportedAnimation.prototype = {
    //匀速旋转动画实现
    //(dom:JQuery dom对象, angle_start:起始角度, angle_end:结束角度, speed:动画持续的时间, fn:动画结束后执行的函数)
    rotate:function (dom,angle_start,angle_end,speed,fn){
        var isAnimated = true;
        if(isAnimated)
        {
            isAnimated = false;
            dom.length > 0 ? dom : console.log("参数(1)错误:获取dom对象失败");
            if(angle_end === angle_start)
                console.log("参数(2,3)错误:起始值与结束值相同");
            else var step = (angle_end - angle_start)/(speed/10);
            speed > 10 ? speed : console.log("参数(4)错误:动画时间不能小于10");
            var rotate_jsq = setInterval(function ()
            {
                angle_start += step;
                if(Math.abs(angle_end - angle_start) < 1){
                    isAnimated = true;
                    angle_start = angle_end;
                    clearInterval(rotate_jsq);
                    if($.isFunction(fn))
                        fn();
                }
                dom.css({transform:"rotate(" + angle_start + "deg)"});
            },10);
        }
    }
}
var jua = new JqueryUnsupportedAnimation();