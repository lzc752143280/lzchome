//tabÇÐ»»
    function ontab(obj){
        $("#"+obj+" span").bind({
            mouseover:function(){
                $("#"+obj+" span").css({background:"#F5F5F5"});
                $("#"+obj+" span").css({borderBottom:"1px solid #D6D6D6"});
                $("#"+obj+" span").children("a").css({color:"#646464"});
                $(this).css({background:"#FFF"});
                $(this).css({borderBottom:"0"});
                $(this).children("a").css({color:"#000"});
                var index = $("#"+obj+" span").index(this);
                $("#"+obj+" .content p").css({display:"none"});
                $("#"+obj+" .content p").eq(index).css({display:"block"});
            }
        });
    }
    ontab("tab1");//µ÷ÓÃ#tab1
    ontab("tab2");