var aboutWidth = document.documentElement.clientHeight;
$("#main .about").css({height:aboutWidth});
if(document.documentElement.clientWidth >= 768){
    setTimeout(function() {
    $(".mask_top_left,.mask_top_right").animate({width:"0"},1000,function () {
        $(".mask_middle").animate({marginTop:"500px"},2000,function () {
            $(".mask_bottom").animate({width:"0",marginLeft:"375px"},1000,function () {
                $(".about_mask").hide();
            });
        });
    });
}, 1000);
};