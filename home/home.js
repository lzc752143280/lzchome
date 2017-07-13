(function () {
    $('#fullpage').fullpage({
        'css3': true,
        'sectionsColor': ['#111', '#87b0a5', '#945c4c', '#a29971'],
        'navigation': true,
        'navigationPosition': 'right',
        'navigationColor': '#87b0a5',
        'afterLoad': function (anchorLink, index) {
            //var loadedSection = $(this);
            if (index == 2) {
                $(".page2 .content_right").addClass("reduce_line_height");
                $(".painting1").addClass("showPainting1");
                $(".painting2").addClass("showPainting2");
                setTimeout(function () {
                    $(".page2 .next_page").show();
                }, 1500);
            }
            if (index == 3) {
                var $p1 = $(".page3 .content div:nth-child(1)");
                var $p2 = $(".page3 .content div:nth-child(2)");
                var $p3 = $(".page3 .content div:nth-child(3)");
                var p1 = 0,
                    p2 = 0,
                    p3 = 0;

                function printf(pn, pw, pdom) {
                    setTimeout(function () {
                        pn += 22;
                        if (pn <= pw) {
                            pdom.css({
                                width: pn
                            });
                            printf(pn, pw, pdom);
                        } else {
                            pdom.css({
                                borderRight: "none"
                            });
                            if (pdom == $p1) {
                                $p2.show();
                                printf(p2, 506, $p2);
                            }
                            if (pdom == $p2) {
                                $p3.show();
                                printf(p3, 484, $p3);
                            }
                            if (pdom == $p3) {
                                setTimeout(function () {
                                    $(".page3 .next_page").show();
                                }, 1000);
                            }
                        }
                    }, 100);
                }
                if ($p1.width() == 0 && document.body.offsetWidth > 768) {
                    $p1.show();
                    printf(p1, 836, $p1);
                } else $(".page3 .next_page").show();
            }
            if (index == 4) {
                if (document.body.offsetWidth > 768) {
                    $(".page4 .content div:nth-child(1) span").addClass("showText");
                    setTimeout(function () {
                        $(".page4 .content div:nth-child(2) span").addClass("showText");
                    }, 500);
                    setTimeout(function () {
                        $(".page4 .content div:nth-child(3) span").addClass("showText");
                    }, 1000);
                    setTimeout(function () {
                        $(".page4 .content .seal").addClass("showSeal");
                    }, 1500);
                    setTimeout(function () {
                        $(".page4 .next_page").show();
                    }, 2000);
                }else $(".page4 .next_page").show();
            }
        }
    })
})();

// $(".page2 .content_right").addClass("reduce_line_height");
function clock() {
    var date;
    var ms = 0,
        s = 0,
        m = 0,
        h = 0;
    var $second = $("#secondHand");
    var $minute = $("#minuteHand");
    var $hour = $("#hourHand");
    var $ampm = $(".haeremai span");
    date = new Date();
    ms = date.getMilliseconds();
    s = date.getSeconds();
    m = date.getMinutes() + (ms / 1000 + s) / 60;
    h = date.getHours() + m / 60;
    if (h >= 0 && h < 5)
        $ampm.text("凌晨好");
    else if (h < 8)
        $ampm.text("早晨好");
    else if (h < 11)
        $ampm.text("上午好");
    else if (h < 14)
        $ampm.text("中午好");
    else if (h < 17)
        $ampm.text("下午好");
    else if (h < 19)
        $ampm.text("傍晚好");
    else if (h < 22)
        $ampm.text("晚上好");
    else
        $ampm.text("深夜好");
    jua.rotate($second, 0, (s + 1) * 6, 1000);
    jua.rotate($minute, 0, m * 6, 1000);
    jua.rotate($hour, 0, h * 30, 1000, function () {
        setInterval(time, 1000);
        $ampm.addClass("showHaeremai");
        setTimeout(function () {
            $(".page1 .next_page").show();
        }, 1000);
    });

    function time() {
        date = new Date();
        ms = date.getMilliseconds();
        s = date.getSeconds();
        m = date.getMinutes() + (ms / 1000 + s) / 60;
        h = date.getHours() + m / 60;
        $second.css({
            transform: "rotate(" + s * 6 + "deg)"
        });
        $minute.css({
            transform: "rotate(" + m * 6 + "deg)"
        });
        $hour.css({
            transform: "rotate(" + h * 30 + "deg)"
        });
    }
}
clock();
if (document.body.offsetWidth <= 768) {
    $("#myVideo").remove();
}