(function () {
    var percents = [95, 95, 70, 80, 60, 20, 90, 60, 80];//百分比参数
    //遍历每一个圆环
    $('.circle').each(function (index, e) {
        var percent = percents[index];
        changePercent(percent, $(e));
    });
    //圆环和百分比增长实现
    function changePercent(percent, dom) {
        var percent_begin = 0;
        var angle_begin = 0;
        var angle_end = percent * 3.6;
        var jsq = setInterval(function () {
            if (percent_begin < percent) {
                percent_begin++;
                dom.find('span').text(percent_begin);
                angle_begin = percent_begin * 3.6;
                if (angle_begin <= 180) {
                    dom.find('.right').css('transform', "rotate(" + angle_begin + "deg)");
                } else {
                    dom.find('.right').css('transform', "rotate(180deg)");
                    dom.find('.left').css('transform', "rotate(" + (angle_begin - 180) + "deg)");
                };
                if (percent_begin >= 75) {
                    dom.css({
                        background: "#0099CC"
                    });
                } else if (percent_begin >= 50) {
                    dom.css({
                        background: "#7AC3B1"
                    });
                } else if (percent_begin >= 25) {
                    dom.css({
                        background: "#FCCC38"
                    });
                } else if (percent_begin >= 0) {
                    dom.css({
                        background: "#E03B33"
                    });
                }
            } else clearInterval(jsq);
        }, 40);
    }
    //圆环翻转实现
    if (document.body.offsetWidth >= 768) {
        var enterTimeStamp, leaveTimeStamp;
        var stayTime_jsq;
        $(".skill_info").on("mouseenter", function () {
            var $that = $(this);
            enterTimeStamp = new Date().getTime();
            $(".skill_info .detail").hide();
            stayTime_jsq = setTimeout(function () {
                var $skillMask = $that.find(".mask");
                jua.rotateY($skillMask, 0, 90, 200, function () {
                    jua.rotateY($skillMask, 90, 0, 200);
                });
                $that.find(".percent").fadeOut(200, function () {
                    $that.find(".detail").fadeIn(200);
                });
            }, 200);
        });
        $(".skill_info").on("mouseleave", function () {
            var $that = $(this);
            leaveTimeStamp = new Date().getTime();
            if ((leaveTimeStamp - enterTimeStamp) < 200)
                clearTimeout(stayTime_jsq);
            else {
                var $skillMask = $that.find(".mask");
                setTimeout(function() {
                    jua.rotateY($skillMask, 0, 90, 200, function () {
                        jua.rotateY($skillMask, 90, 0, 200);
                    });
                    $that.find(".detail").fadeOut(200, function () {
                        $that.find(".percent").fadeIn(200);
                    });
                }, 200);
            }
        });
    }
})();