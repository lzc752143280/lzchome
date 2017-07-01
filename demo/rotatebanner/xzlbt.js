/**
 * Created by Lzc on 2017/4/16.
 */
var json = [
    {   //  0
        width:400,
        top:20,
        left:50,
        opacity:20,
        zIndex:2
    },
    {  // 1
        width:600,
        top:70,
        left:0,
        opacity:80,
        zIndex:3
    },
    {   // 2
        width:800,
        top:100,
        left:200,
        opacity:100,
        zIndex:4
    },
    {  // 3
        width:600,
        top:70,
        left:600,
        opacity:80,
        zIndex:3
    },
    {   //4
        width:400,
        top:20,
        left:750,
        opacity:20,
        zIndex:2
    }
];
var flag;
change();
function change(){
    for(var i=0;i<json.length;i++)
    {
        $(".rotate img:eq("+i+")").animate({
            width:json[i].width,
            top:json[i].top,
            left:json[i].left,
            opacity:(json[i].opacity)/100,
            zIndex:json[i].zIndex
        },400,function(){ flag = true;}).css({flter:"alpha(opacity="+json[i].opacity+")"});
    }
}
$(".prev").click(function(){
    if(flag)
    {
        json.unshift(json.pop());
        change();
        flag = false;
    }
});
$(".next").click(function(){
    if(flag)
    {
        json.push(json.shift());
        change();
        flag = false;
    }
});
