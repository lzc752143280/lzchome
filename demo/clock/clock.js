/**
 * Created by Lzc on 2017/4/5.
 */
    var date;
    var ms = 0, s = 0, m = 0, h = 0;
    var second = document.getElementById("secondhand");
    var minute = document.getElementById("minutehand");
    var hour = document.getElementById("hourhand");
    var ampm = document.getElementById("ampm");
    window.setInterval("time()",100);
    function time()
    {
        /*document.execCommand("BackgroundImageCache", false, true);(消除抖动无效)*/
        date = new Date();
        ms = date.getMilliseconds();
        s = date.getSeconds();
        m = date.getMinutes()+(ms/1000+s)/60;
        h = date.getHours()+m/60;
        second.style.WebkitTransform = "rotate("+ s*6 +"deg)";
        minute.style.WebkitTransform = "rotate("+ m*6 +"deg)";
        hour.style.WebkitTransform = "rotate("+ h*30 +"deg)";
        second.style.msTransform = "rotate("+ s*6 +"deg)";
        minute.style.msTransform = "rotate("+ m*6 +"deg)";
        hour.style.msTransform = "rotate("+ h*30 +"deg)";
        if(h>=0&&h<5)
            ampm.children[0].innerHTML = "凌 晨";
        else if(h<8)
            ampm.children[0].innerHTML = "早 晨";
        else if(h<11)
            ampm.children[0].innerHTML = "上 午";
        else if(h<14)
            ampm.children[0].innerHTML = "中 午";
        else if(h<17)
            ampm.children[0].innerHTML = "下 午";
        else if(h<19)
            ampm.children[0].innerHTML = "傍 晚";
        else if(h<22)
            ampm.children[0].innerHTML = "晚 上";
        else
            ampm.children[0].innerHTML = "深 夜";
    }
