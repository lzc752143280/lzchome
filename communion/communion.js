var headPicNum = 0;//头像编号
var nickName = "";//昵称
//检测缓存并显示
if (localStorage.nickName) {
    if (document.body.offsetWidth < 768)
        $(".user_id_mobile").html('<p>你好，' + localStorage.nickName + '</p>').hide().show("slow");
    else $(".user_id").html('<p>你好，' + localStorage.nickName + '</p>').hide().show("slow");
}
//显示设置
$(".user_id button").on('click', function () {
    $(".communion_container .setting").show();
});
//关闭设置
$(".setting_close").on('click', function () {
    $(".communion_container .setting").hide();
});
//更换头像
$(".inner_pic").on('click', function () {
    $(".setting_option ul").show();
});
//选择头像
$(".setting_option ul li").on('click', function () {
    $(".setting_option ul").hide();
    headPicNum = $(".setting_option ul li").index(this);
    $(".inner_pic").css({
        background: 'url("../images/headpic/headpic_' + headPicNum + '.png") no-repeat'
    });
});
//昵称和头像审核
$(".setting_option button").on('click', function () {
    nickName = $("#nickName").val();
    $.trim(nickName);
    console.log(nickName.length);
    if (!!nickName == false || nickName == "Admin" || nickName == "admin" || nickName.length > 6) {
        $(".nickName_tip").text("昵称非法或超过6个字符");
        $("#nickName").focus();
    } else {
        $(".communion_container .setting").hide();
        localStorage.nickName = nickName;
        localStorage.headPicNum = headPicNum;
        $(".user_id").html('<p>你好，' + localStorage.nickName + '</p>').hide().show("slow");
    }
});

//移动端昵称审核
$(".user_id_mobile button").on('click', function () {
    nickName = $(".user_id_mobile input").val();
    $.trim(nickName);
    if (!!nickName == false || nickName == "Admin" || nickName == "admin" || nickName.length > 6) {
        $(".nickName_tip").text("昵称非法或超过6个字符");
        $(".user_id_mobile input").focus();
    } else {
        localStorage.nickName = nickName;
        $(".user_id_mobile").html('<p>你好，' + localStorage.nickName + '</p>').hide().show("slow");
    }
});

//发送信息功能
$(".post_box button").on('click', function () {
    var message = $(".post_textarea").val();
    headPicNum = localStorage.headPicNum || 0;
    if (!!localStorage.nickName === false || message.length < 1) {
        $(".send_tip").text("没有设置昵称或发送内容为空");
    } else {
        $(".send_tip").text("");
        $.ajax({
            url: "./communion/sendMessage.php",
            type: "post",
            data: {
                nickName: localStorage.nickName,
                headPicNum: headPicNum,
                message: message
            },
            success: function (data) {
                if (data == "sendSuccess") {
                    $(".post_textarea").val("");
                    $(".send_tip").text("发送成功");
                    setTimeout(function() {
                        $(".send_tip").text("");
                    }, 5000);
                    getComment();
                    $(".load_more").show();
                }else {
                    $(".send_tip").text("发送失败");
                    setTimeout(function() {
                        $(".send_tip").text("");
                    }, 5000);
                }
            }
        });
    };
});
//点赞功能
function addAdmire(that) {
    var $that = $(that);
    var admire = parseInt($that.find("span").text());
    admire++;
    $that.find("span").text(admire);
    var id = $that.parents().eq(2).attr("id");
    id = id.replace(/[^0-9]/ig, "");
    $.ajax({
        url: "./communion/admire.php",
        type: "post",
        data: {
            id: id,
            admire: admire
        },
        success: function (data) {}
    });
}
//从服务器获取留言
function getComment() {
    $.ajax({
        url: "./communion/getComment.php",
        type: "post",
        success: function (data) {
            $(".user_comment").hide().html(data).fadeIn();

            $(".user_comment .comment .comment_fn i").on('click', function () {
                addAdmire(this);
            });
        }
    });
}
getComment();
//从服务器获取Admin的赞
function getAdminAdmire() {
    $.ajax({
        url: "./communion/getAdminAdmire.php",
        type: "post",
        success: function (data) {
            $(".admin_comment .comment_fn span").text(data);
        }
    });
}
getAdminAdmire();
//显示全部
$(".load_more").on('click', function () {
    var id = $(".user_comment .comment").attr("id");
    id = id.replace(/[^0-9]/ig, "");
    $.ajax({
        url: "./communion/getComment.php",
        type: "post",
        data: {
            id: id
        },
        success: function (data) {
            $(".user_comment").append(data);
            $(".load_more").hide();
            $(".user_comment .comment .comment_fn i").off("click");
            $(".user_comment .comment .comment_fn i").on('click', function () {
                addAdmire(this);
            });
        }
    });
});
//给Admin点赞
$(".admin_comment .comment_fn i").on('click', function () {
    var admire = parseInt($(".admin_comment .comment_fn span").text());
    admire++;
    $(".admin_comment .comment_fn span").text(admire);
    $.ajax({
        url: "./communion/adminAdmire.php",
        type: "post",
        data: {
            admire: admire
        },
        success: function (data) {}
    });
});