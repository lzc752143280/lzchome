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
    $mask.fadeIn(300);
    $navMenuBtn.animate({
        width: 30,
        height: 30
    }, 300);
    if ($nav.width() < 200)
        jua.rotate($navMenuBtn, 0, -45, 300);
    $(".weather").fadeIn(200);
};

//收起侧边栏
function closeSidebar(event) {
    if (event)
        event.stopPropagation();
    $nav.animate({
        width: "40px"
    }, 300);
    $mask.fadeOut(300);
    $navMenuBtn.animate({
        width: 22,
        height: 22
    }, 300);
    if ($nav.width() > 40)
        jua.rotate($navMenuBtn, -45, 0, 300);
    $(".weather").fadeOut(200);
};

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
};

$navMenu.on('click', function () {
    console.log($(this).children().attr('id'));
    var onhash = window.location.hash.slice(2);
    console.log(onhash);
    if (onhash === 'home' && $(this).children().attr('id') === 'home'){

    }else $.fn.fullpage.destroy('all'); //清除fullpage对象,重新初始化
});

function getPage(url) {
    $.ajax({
        type: 'get',
        url: url,
        dataType: 'html',
        success: function (html) {
            $(".content_loading_animation").hide();
            closeSidebar();
            $('#content #main').fadeOut().html(html).fadeIn(500);
            $("script[src='./home/home.js']").remove();
            $("script[src='./skill/skill.js']").remove();
            $("script[src='./document/document.js']").remove();
            $("script[src='./communion/communion.js']").remove();
            $("script[src='./about/about.js']").remove();
            var hash = window.location.hash.slice(2);
            $('<script src="./' + hash + '/' + hash + '.js"></script>').appendTo($("body")); //动态添加js
        }
    });
};

$('document').ready(function () {
    //创建一些在用户发出正确路由时执行的功能。
    var showHome = function () {
        var url = './home/index.html';
        getPage(url);
    };
    var showSkill = function () {
        var url = './skill/index.html';
        getPage(url);
    };
    var showDocument = function () {
        var url = './document/index.html';
        getPage(url);
    };
    var showCommunion = function () {
        var url = './communion/index.html';
        getPage(url);
    };
    var showAbout = function () {
        var url = './about/index.html';
        getPage(url);
    };

    var onRoute = function () {};
    var beforeRoute = function () {
        var route = window.location.hash.slice(2);
        changeNavMenu($("#" + route).parent());
        $(".content_loading_animation").show();
    }
    //定义路由表。
    var routes = {
        '/home': showHome,
        '/skill': showSkill,
        '/document': showDocument,
        '/communion': showCommunion,
        '/about': showAbout
    };
    //实例化路由器。
    var router = Router(routes);
    //全局配置设置。
    router.configure({
        before: beforeRoute,
        on: onRoute
    });

    router.init();
});

(function () {
    var i = 0;
    //a: X轴的一半, b: Y轴的一半, r: 圆的半径);
    function dotPosition() {
        var a = $(".content_loading_animation").width() / 2;
        var b = $(".content_loading_animation").height() / 2;
        var r = a;
        var $dot = $(".content_loading_animation ul li");
        var angle = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]; //12个圆周上的点
        for (var i = 0; i < angle.length; i++) {
            var radian = (2 * Math.PI / 360) * angle[i] //固定公式
            $dot[i].style.left = parseInt(a + Math.sin(radian) * r) - 9 + "px";
            $dot[i].style.top = parseInt(b + Math.cos(radian) * r) - 9 + "px";
        }
    }
    dotPosition();
    //canvas绘制圆环动画
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    drawNew(ctx, 0, 0);

    function drawNew(ctx, begin, end) {
        ctx.clearRect(0, 0, 100, 100);
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
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
        // 360° = Math.PI*2; 公式
        requestAnimationFrame(function () {
            drawNew(ctx, begin, end);
        });
    }
})();

//天气
(function () {
    //获取ip地址归属地
    $.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", function (_result) {
        var city = encodeURI(remote_ip_info.city);
        getWeather(city);
    });
    //获取天气信息
    function getWeather(city) {
        $.ajax({
            type: "get",
            dataType: "json",
            url: "https://free-api.heweather.com/v5/weather?city=" + city + "&key=763188a5a5fc4e5fb55913009e0ba0c5",
            success: function (data) {
                $(".weather .tmp span").text(data.HeWeather5[0].now.tmp); //当前温度
                $(".weather .cond span").text(data.HeWeather5[0].now.cond.txt); //当前天气
                $(".weather .city span").text(data.HeWeather5[0].basic.city); //当前城市
                $(".weather .wind span").text(data.HeWeather5[0].now.wind.dir); //当前风向
                //$(".weather .wind span").text(data.HeWeather5[0].now.wind.sc);//当前风速
                $(".weather .aqi span").text(data.HeWeather5[0].aqi.city.qlty); //空气质量
            }
        });
    };
})();