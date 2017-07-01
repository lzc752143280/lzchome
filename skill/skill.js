(function () {
    var percents = [95, 95, 70, 80, 60, 20, 20, 30, 50];
    $('.circle').each(function (index, e) {
        var percent = percents[index];
        changePercent(percent, $(e));
    });

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
    if (document.body.offsetWidth >= 768) {
        $(".skill_info").on("mouseenter", function () {
            var $that = $(this);
            $that.find(".mask").attr("class", "mask turn_over");
            $that.find(".percent").fadeOut(500, function () {
                $that.find(".detail").fadeIn(500);
            });
        });
        $(".skill_info").on("mouseleave", function () {
            var $that = $(this);
            $that.find(".mask").attr("class", "mask turn_back");
            setTimeout(function () {
                $that.find(".detail").fadeOut(500, function () {
                    $that.find(".percent").fadeIn(500);
                });
            }, 550);
        });
    }
})();