/**
 * Created by Lzc on 2017/4/9.
 */
divdrag(".registerbox",".drag");//�κδ�ֱˮƽ���еĺ��Ӷ����Ե���
function divdrag(movebox,dragbox){//��һ������ΪҪ�ƶ��ĺ���,�ڶ�������Ϊ����϶��Ĺ��ܺ���
    var x,y;
    var boxW = $(movebox).outerWidth();//div����ʵ���
    var boxH = $(movebox).outerHeight();//div����ʵ�߶�
    var domW = $(document).width() - boxW/2;//���ݴ��ڴ�С�������������ƶ�����
    var domH = $(document).height() - boxH/2;//���ݴ��ڴ�С��������������ƶ�����
    $(dragbox).mousedown(
        function (event)
        {
            var distanceX = event.clientX - $(movebox).offset().left;//��갴��ʱ��λ�õ��ƶ�������߿�ľ���
            var distanceY = event.clientY - $(movebox).offset().top;//��갴��ʱ��λ�õ��ƶ������ϱ߿�ľ���
            $(document).mousemove(
                function (event)
                {
                    x = event.clientX+boxW/2-distanceX;
                    y = event.clientY+boxH/2-distanceY;
                    x < boxW/2 ? x = boxW/2 : x;
                    x > domW ? x = domW : x;
                    y < boxH/2 ? y = boxH/2 : y;
                    y > domH ? y = domH : y;
                    $(movebox).css("top",y+"px");
                    $(movebox).css("left",x+"px");
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                }
            )
        }
    );
    $(document).mouseup(
        function ()
        {
            $(document).unbind("mousemove");
        }
    );
}
$(".top span").click(
    function(event){
    $(".registerbox").css("display","block")
        var event = event||window.event;
        if(event.stopPropagation)
        event.stopPropagation();
        else event.cancelBubble = true;
    }
);
//����հ״�����
document.onclick = function(event){
    var event = event || window.event;
    var classname = event.target ? event.target.className : event.srcElement.className;
    if(classname != "registerbox"&&classname != "drag")
        $('.registerbox').css("display","none");
}