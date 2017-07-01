/**
 * Created by Lzc on 2017/4/7.
 */
var imgname = [1,2,3,4,5];
var i;
$(".spec-list li").bind(
   "mouseover",function()
    {
       $(".spec-list li").css("border","2px solid #FFF");
       this.style.border = "2px solid #E53E41";
       i = $(".spec-list li").index(this);
       $(".product").css("background-image","url('images/"+imgname[i]+".jpg')");
       $(".details").css("background-image","url('images/big"+imgname[i]+".jpg')");
   }
);
var zb = $(".product").offset();
var selectorW = $(".selector").width();
var selectorH = $(".selector").height();
var productW = $(".product").width();
var productH = $(".product").height();
$(".product").bind({
    mouseover:function()
    {
        $(".selector").css("display","block");
        $(".details").css("display","block")
    },
    mouseout:function()
    {
        $(".selector").css("display","none");
        $(".details").css("display","none")
    },
    mousemove:function(event)
    {
        var x = event.clientX - zb.left - selectorW/2;
        var y = event.clientY - zb.top - selectorH/2;
        if(x<0)
            x = 0;
        else if(x>productW-selectorW)
            x = productW-selectorW;
        if(y<0)
            y = 0;
        else if(y>productH-selectorH)
            y = productH-selectorH;
        $(".selector").css("left",x+"px");
        $(".selector").css("top",y+"px");
        $(".details").css("background-position",-x/450*800+"px "+ -y/450*800 +"px");
    }
});