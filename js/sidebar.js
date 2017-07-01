/**
 * Created by Lzc.
 */
$sidebar = $("#sidebar");
$content = $("#content");
$mask = $("#content .mask");
$nav = $("#nav");
$navMenuBtn = $("#nav .menu");
$navMenu = $("#nav ul li");
$main = $("#main");
var list = ["home", "skill", "document", "communion", "about"];

//展开侧边栏
function openSidebar() {
    $nav.animate({
        width: "200px"
    }, 300);
    $content.animate({
        marginLeft: "200px"
    }, 300);
    $mask.fadeIn(300);
    $navMenuBtn.animate({
        width: 30,
        height: 30
    }, 300);
    if ($nav.width() < 200)
        jua.rotate($navMenuBtn, 0, -45, 300);
}

//收起侧边栏
function closeSidebar(event) {
    event.stopPropagation();
    $nav.animate({
        width: "40px"
    }, 300);
    $content.animate({
        marginLeft: "40px"
    }, 300);
    $mask.fadeOut(300);
    $navMenuBtn.animate({
        width: 22,
        height: 22
    }, 300);
    if ($nav.width() > 40)
        jua.rotate($navMenuBtn, -45, 0, 300);
}

//侧边栏点击事件
$sidebar.on("click", openSidebar);
$content.add($navMenuBtn).on("click", function (event) {
    if ($nav.width() > 40)
        closeSidebar(event);
});

//导航菜单动画实现
function changeNavMenu(navMenu) {
    $navMenu.children().removeClass("active");
    navMenu.siblings().animate({
        paddingLeft: 0
    }, 200);
    navMenu.animate({
        paddingLeft: 10
    }, 200);
    navMenu.children("a").addClass("active");
}

//导航菜单点击事件
$navMenu.on("click", function (event) {
    var $that = $(this);
    changeNavMenu($that);
    //捕获点击事件
    // $navMenu.on('click',function(){
    //     return false;
    // });
});

//导航菜单跟随前进后退事件变化
window.onpopstate = function () {
    var title = $main.children().attr("class");
    for (var i in list) {
        if (list[i] == title) {
            setTimeout(changeNavMenu($navMenu.eq(i)), 100);
        }
    }
}

//首先加载一次首页
var onhash = window.location.hash.replace(/#\//, "");
if (onhash) {
    $.ajax({
        type: "get",
        url: onhash,
        dateType: "html",
        success: function (html) {
            $main.html(html).hide().fadeIn(1000);
            $(window).trigger("popstate");
            var id = onhash.replace(/(\w)\/.*/,"$1");
            //$('<link rel="stylesheet" href="./'+id+'/'+ id +'.css">').appendTo($("head"));//动态添加CSS
            $('<script src="./'+id+'/'+ id +'.js"><script>').appendTo($("head"));//动态添加js
        },
        error: function () {
            console.log("url链接错误");
        }
    });
}

//给a标签绑定pjax事件
$.pjax({
    selector: 'a[data-pjax]',
    container: '#main', //内容替换的容器
    show: 'fade', //展现的动画，支持默认和fade, 可以自定义动画方式，这里为自定义的function即可。
    cache: false, //是否使用缓存
    storage: false, //是否使用本地存储
    timeout: 100000,
    titleSuffix: "", //标题后缀
    filter: function () {},
    callback: function (status) {
        var type = status.type;
        switch (type) {
            case 'success':var id = $(this).attr("id");
                //$('<link rel="stylesheet" href="./'+id+'/'+ id +'.css">').appendTo($("head"));//动态添加CSS
                $('<script src="./'+id+'/'+ id +'.js"><script>').appendTo($("head"));//动态添加js
                break; //正常
            case 'cache':
                ;
                break; //读取缓存
            case 'error':
                ;
                break; //发生异常
            case 'hash':
                ;
                break; //只是hash变化
        }
    }
});

//loading动画
$main.on('pjax.start', function () {
    $(".content_loading_animation").show();
}).on('pjax.end', function () {
    $(".content_loading_animation").hide();
    closeSidebar(event);
    ////解除捕获点击事件
    // $navMenu.off('click',function(){
    // });
});

(function () {
    var i = 0;
    //a: X轴的一半, b: Y轴的一半, r: 圆的半径);
    function dotPosition() {
        var a = $(".content_loading_animation").width() / 2;
        var b = $(".content_loading_animation").height() / 2;
        var r = a;
        var $dot = $(".content_loading_animation ul li");
        var angle = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        for (var i = 0; i < angle.length; i++) {
            var radian = (2 * Math.PI / 360) * angle[i] //固定公式
            $dot[i].style.left = parseInt(a + Math.sin(radian) * r) - 9 + "px";
            $dot[i].style.top = parseInt(b + Math.cos(radian) * r) - 9 + "px";
        }
    }
    dotPosition();

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    drawNew(ctx, 0, 0);

    function drawNew(ctx, begin, end) {
        ctx.clearRect(0, 0, 100, 100);
        ctx.beginPath();
        ctx.strokeStyle = "#555";
        if (end < Math.PI * 2) {
            end += Math.PI / 50;
        } else {
            begin += Math.PI / 50;
            end = Math.PI * 2;
            if (begin >= Math.PI * 2 && end >= Math.PI * 2) {
                begin = 0;
                end = 0;
            }
        };
        ctx.arc(30, 20, 15, begin, end, false);
        ctx.stroke();
        // 360° = Math.PI*2;
        requestAnimationFrame(function () {
            drawNew(ctx, begin, end);
        });
    }
})();

//天气数据加载
(function () {
    $.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function (_result) {
            getWeather(remote_ip_info.city);
        });
        function getWeather(city) {
            $.ajax({
                type: "get",
                dataType: "json",
                url: "https://free-api.heweather.com/v5/weather?city="+ city +"&key=763188a5a5fc4e5fb55913009e0ba0c5",
                success: function (data) {
                    $(".weather .tmp span").text(data.HeWeather5[0].now.tmp);//当前温度
                    $(".weather .cond span").text(data.HeWeather5[0].now.cond.txt);//当前天气
                    $(".weather .city span").text(data.HeWeather5[0].basic.city);//当前城市
                    $(".weather .wind span").text(data.HeWeather5[0].now.wind.sc);//当前风速
                    $(".weather .aqi span").text(data.HeWeather5[0].aqi.city.qlty);//空气质量
                }
            });
        };
})();
// $sidebar.pjax('a','#main',{timeout:3000});
// //入场动画

// $(document).on("pjax:success",function(options, data, status, xhr){
//     //data:返回的内容
//     //status:状态(如:success)
//     //xhr:XMLHttpRequest对象
//     //contents:返回的jquery对象
//     $main.hide().fadeIn(1000);
//     /*var chList = ["首页","雕虫小技","IE那些事","吐槽本站","个人资料"];
//     var url = window.location.pathname;
//     for(var i = 0; i < list.length; i++)
//     {
//         if(url.indexOf(list[i]) != -1)
//             $("title").text(chList[i]);
//     }*/
// })

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