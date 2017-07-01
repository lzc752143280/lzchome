/**
 * Created by Lzc on 2017/3/28.
 */
//导航栏
$(".nav li").bind({
        mouseover:function (){
        $(this).css({background:"#252947"});//this li背景颜色
        $(this).children().css({color:"white"});//this li a字体颜色
    },
    mouseout:function () {
        $(this).parent().children().css({background: "#191D3A"});//所有li背景还原
        $(this).parent().children().children().css({color: "#818496"});//所有li a字体还原
        $(this).parent().find("#li1").css({background: "#252947"});//li1 背景选中
        $(this).parent().find("#li1").find("a").css({color: "white"});//li1 a 字体选中
    }
});
//在线游戏控件
$(".kj").bind({
    mouseover:function(){
        $(".kongjian-open").css({display:"block"});
    },
    mouseout:function (){
        $(".kongjian-open").css({display:"none"});
    }
});
//banner2各版本下载
$("#l1").bind({
    mouseover:function(){
        $(this).css({backgroundColor:"rgba(255,255,255,0.8)"});
        $(this).find("li").css({color:"#444866"});
        $(this).css({backgroundPosition: "28px -182px"})
    },
    mouseout:function (){
        $(this).css({backgroundColor:"rgba(255,255,255,0.2)"});
        $(this).find("li").css({color:"white"});
        $(this).css({backgroundPosition: "-212px -182px"})
    }
});
$("#l2").bind({
    mouseover:function(){
        $(this).css({backgroundColor:"rgba(255,255,255,0.8)"});
        $(this).find("li").css({color:"#444866"});
        $(this).css({backgroundPosition: "26px 18px"})
    },
    mouseout:function (){
        $(this).css({backgroundColor:"rgba(255,255,255,0.2)"});
        $(this).find("li").css({color:"white"});
        $(this).css({backgroundPosition: "-219px 18px"})
    }
});
$("#l3").bind({
    mouseover:function(){
        $(this).css({backgroundColor:"rgba(255,255,255,0.8)"});
        $(this).find("li").css({color:"#444866"});
        $(this).css({backgroundPosition: "21px -82px"})
    },
    mouseout:function (){
        $(this).css({backgroundColor:"rgba(255,255,255,0.2)"});
        $(this).find("li").css({color:"white"});
        $(this).css({backgroundPosition: "-220px -82px"})
    }
});
$("#l4").bind({
    mouseover:function(){
        $(this).css({backgroundColor:"rgba(255,255,255,0.8)"});
        $(this).find("li").css({color:"#444866"});
        $(this).css({backgroundPosition: "21px -485px"})
    },
    mouseout:function (){
        $(this).css({backgroundColor:"rgba(255,255,255,0.2)"});
        $(this).find("li").css({color:"white"});
        $(this).css({backgroundPosition: "-215px -485px"})
    }
});
//banner3各版本下载
$(".bc3 .version ul a").bind({
    mouseover:function(){
        $(this).css({backgroundColor:"rgb(255,255,255)"});
    },
    mouseout:function (){
        $(this).css({backgroundColor:"rgba(255,255,255,0.7)"});
    }
});
//banner切换
var i = 1;
var jsq;
function jishiqi(){
    jsq = window.setInterval("qiehuan()",4000);
}
function jishiqi2(){
    jsq2 = window.setInterval("qiehuan2()",4500);
}
jishiqi();
jishiqi2();
function qiehuan(){
    i++;
    if(i>3)
    i = 1;
    $(".banner"+i).fadeIn("slow");
    //$(".banner"+i).css({display:"block"});
    $(".banner"+i).siblings().css({display:"none"});
    $(".dian div span").css({opacity: "0.5"});
    $("#d"+i).css({opacity: "1"});
    }
$(".banner").bind({
    mouseover:function(){
        window.clearInterval(jsq);
    },
    mouseout:function(){
        jishiqi();
    }
});
$("#d1").bind({
    mouseover:function(){
        i = 1;
        window.clearInterval(jsq);
        $(".banner1").fadeIn("slow");
       // $(".banner1").css({display:"block"});
        $(".banner1").siblings().css({display:"none"});
        $(".dian div span").css({opacity: "0.5"});
        $("#d1").css({opacity: "1"});
    },
    mouseout:function(){
        jishiqi();
    }
});
$("#d2").bind({
    mouseover:function(){
        i = 2;
        window.clearInterval(jsq);
        $(".banner2").fadeIn("slow");
        //$(".banner2").css({display:"block"});
        $(".banner2").siblings().css({display:"none"});
        $(".dian div span").css({opacity: "0.5"});
        $("#d2").css({opacity: "1"});
    },
    mouseout:function(){
        jishiqi();
    }
});
$("#d3").bind({
    mouseover:function(){
        i = 3;
        window.clearInterval(jsq);
        $(".banner3").fadeIn("slow");
        //$(".banner3").css({display:"block"});
        $(".banner3").siblings().css({display:"none"});
        $(".dian div span").css({opacity: "0.5"});
        $("#d3").css({opacity: "1"});
    },
    mouseout:function(){
        jishiqi();
    }
});
//视频切换
var j = 1;
var jsq2;
var num = [0,-1044,-2088,-3132];
function qiehuan2(){
    j++;
    if(j>4)
    j = 1;
    $(".product").animate({left: num[j-1]});
    $(".dian4 div span").css({background: "#B5C0CB"});
    $("#pd"+j).css({background: "#2fbc71"});
}
$(".shipin .ct").bind({
        mouseover:function(){
            window.clearInterval(jsq2);
        },
        mouseout:function(){
            jishiqi2();
        }
    });
$("#pd1").bind({
    mouseover:function(){
        j = 1;
        window.clearInterval(jsq2);
        $(".product").animate({left: num[0]});
        $(".dian4 div span").css({background: "#B5C0CB"});
        $("#pd1").css({background: "#2fbc71"});
    },
    mouseout:function(){
        jishiqi2();
    }
});
$("#pd2").bind({
    mouseover:function(){
        j = 2;
        window.clearInterval(jsq2);
        $(".product").animate({left: num[1]});
        $(".dian4 div span").css({background: "#B5C0CB"});
        $("#pd2").css({background: "#2fbc71"});
    },
    mouseout:function(){
        jishiqi2();
    }
});
$("#pd3").bind({
    mouseover:function(){
        j = 3;
        window.clearInterval(jsq2);
        $(".product").animate({left: num[2]});
        $(".dian4 div span").css({background: "#B5C0CB"});
        $("#pd3").css({background: "#2fbc71"});
    },
    mouseout:function(){
        jishiqi2();
    }
});
$("#pd4").bind({
    mouseover:function(){
        j = 4;
        window.clearInterval(jsq2);
        $(".product").animate({left: num[3]});
        $(".dian4 div span").css({background: "#B5C0CB"});
        $("#pd4").css({background: "#2fbc71"});
    },
    mouseout:function(){
        jishiqi2();
    }
});
//声明关闭
$(".close").bind({
    mouseover:function(){
        $(".close").css({background:"url('images/2a_04.png') no-repeat"});
    },
    mouseout:function(){
        $(".close").css({background:"none"});
    },
    click:function(){
        $(".shengming").css({display:"none"});
    }
});