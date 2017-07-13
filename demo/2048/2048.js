//主功能构造函数
function Block() {}
Block.prototype = {
    creatBlock: function () {
        var num = Math.random();
        if (num > 0.9)
            num = 4;
        else num = 2048;

        var row, col;

        function getPosition() {
            row = Math.floor(Math.random() * 4);
            col = Math.floor(Math.random() * 4);
            if (game.allBlock[row][col] > 1) {
                getPosition();
            }
        };
        getPosition();
        game.allBlock[row][col] = num;
        $("#block_" + row + "_" + col).html('<div class="block block_' + num + ' block_p_' + row + '_' + col + '"><div>');
        localStorage.setItem("allBlock", JSON.stringify(game.allBlock));
    },
    left: function () {
        if (game.check() && game.moveLeft()) {
            this.showBlock();
            setTimeout(this.creatBlock, 200);
        }
    },
    up: function () {
        if (game.check() && game.moveUp()) {
            this.showBlock();
            setTimeout(this.creatBlock, 200);
        }
    },
    right: function () {
        if (game.check() && game.moveRight()) {

            this.showBlock();
            setTimeout(this.creatBlock, 200);
        }
    },
    down: function () {
        if (game.check() && game.moveDown()) {
            this.showBlock();
            setTimeout(this.creatBlock, 200);
        }
    },
    restart: function () {
        $("#block_container div[id^=block_]").html("");
        $(".score .score_num span").text(0);
        game.allBlock = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        game.score = 0;
        localStorage.score = 0;
        $(".chessboard .mask").hide(0);
        $(".chessboard .game_over").removeClass("goTop");
        this.creatBlock();
        this.creatBlock();
    },
    showBlock: function () {
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                var div = document.getElementById("block_" + row + "_" + col);
                var new_num;
                if(game.allBlock[row][col]>2048){
                    new_num = "plus";
                    div.innerHTML = game.allBlock[row][col] == 0 ? "" : "<div class='block block_" + new_num + " block_p_" + row + "_" + col + "'>"+ game.allBlock[row][col] +"<div>";
                }
                else {
                new_num = game.allBlock[row][col];
                div.innerHTML = game.allBlock[row][col] == 0 ? "" : "<div class='block block_" + new_num + " block_p_" + row + "_" + col + "'><div>";
                }
            }
        }
        localStorage.score = game.score; //缓存当前分数
        $(".score .score_num span").text(game.score);
        if (game.best < game.score) {
            game.best = game.score;
            localStorage.best = game.best; //缓存最佳分数
            $(".best .score_num span").text(game.best);
        }
    }
};

//游戏算法
var game = {
    allBlock: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    score: 0,
    best: 0,

    //检测游戏是否结束
    check: function () {
        if (this.canLeft() === false && this.canRight() === false && this.canUp() === false && this.canDown() === false) {
            $(".chessboard .mask").fadeIn("slow");
            $(".chessboard .game_over").addClass("goTop");
            return false;
        }
        return true;
    },

    //left
    canLeft: function () {
        //遍历第二个开始的每个!=0的元素
        for (var row = 0; row < 4; row++) {
            for (var col = 1; col < 4; col++) {
                if (this.allBlock[row][col] != 0) {
                    //左侧数==0或者当前值==左侧值,return true
                    if (this.allBlock[row][col - 1] == 0 || this.allBlock[row][col] == this.allBlock[row][col - 1]) {
                        return true;
                    }
                }
            }
        }
        return false; //不能移动
    },
    getNextRight: function (row, col) { //返回右侧第一个!=0的位置下标,否则返回-1
        for (var i = col + 1; i < 4; i++) {
            if (this.allBlock[row][i] != 0) {
                return i;
            }
        }
        return -1;
    },
    moveLeftOneRow: function (row) { //左移一行
        //遍历row行中的每个元素(最后一个除外)
        for (var col = 0; col < 3; col++) {
            //获得下一个不为0的元素的下标
            var nextCol = this.getNextRight(row, col);
            //如果nextCol==-1，移动完成
            if (nextCol == -1) {
                break;
            } else {
                //去0 如果当前元素==0,与下一个!=0的元素交换值
                if (this.allBlock[row][col] == 0) {
                    this.allBlock[row][col] = this.allBlock[row][nextCol];
                    this.allBlock[row][nextCol] = 0;
                    col--;
                } else if (this.allBlock[row][col] == this.allBlock[row][nextCol]) {
                    //合并
                    this.allBlock[row][col] *= 2;
                    this.score += this.allBlock[row][col];
                    this.allBlock[row][nextCol] = 0;
                }
            }
        }
    },

    moveLeft: function () { //左移所有行
        if (this.canLeft()) { //判断能否左移
            for (var row = 0; row < 4; row++) {
                this.moveLeftOneRow(row);
            }
            return true;
        }
    },

    //right
    canRight: function () {
        //遍历每个!=0的元素
        for (var row = 0; row < 4; row++) {
            for (var col = 0; col < 3; col++) {
                if (this.allBlock[row][col] != 0) {
                    //右侧数==0或者当前值==右侧值,return true
                    if (this.allBlock[row][col + 1] == 0 || this.allBlock[row][col] == this.allBlock[row][col + 1]) {
                        return true;
                    }
                }
            }
        }
        return false; //不能移动
    },
    getNextLeft: function (row, col) { //返回左侧第一个!=0的位置下标,否则返回-1
        for (var i = col - 1; i >= 0; i--) {
            if (this.allBlock[row][i] != 0) {
                return i;
            }
        }
        return -1;
    },
    moveRightOneRow: function (row) { //右移一行
        //遍历row行中的每个元素(最后一个除外)
        for (var col = 3; col > 0; col--) {
            //获得下一个不为0的元素的下标
            var prevCol = this.getNextLeft(row, col);
            //如果nextCol==-1，移动完成
            if (prevCol == -1) {
                break;
            } else {
                //去0 如果当前元素==0,与下一个!=0的元素交换值
                if (this.allBlock[row][col] == 0) {
                    this.allBlock[row][col] = this.allBlock[row][prevCol];
                    this.allBlock[row][prevCol] = 0;
                    col++;
                } else if (this.allBlock[row][col] == this.allBlock[row][prevCol]) {
                    //合并
                    this.allBlock[row][col] *= 2;
                    this.score += this.allBlock[row][col];
                    this.allBlock[row][prevCol] = 0;
                }
            }
        }
    },
    moveRight: function () { //左移所有行
        if (this.canRight()) { //判断能否左移
            for (var row = 0; row < 4; row++) {
                this.moveRightOneRow(row);
            }
            return true;
        }
    },

    //up
    canUp: function () {
        //遍历每个!=0的元素
        for (var row = 1; row < 4; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.allBlock[row][col] != 0) {
                    //上侧数==0或者当前值==上侧值,return true
                    if (this.allBlock[row - 1][col] == 0 || this.allBlock[row][col] == this.allBlock[row - 1][col]) {
                        return true;
                    }
                }
            }
        }
        return false; //不能移动
    },
    getNextDown: function (row, col) { //返回下侧第一个!=0的位置下标,否则返回-1
        for (var i = row + 1; i < 4; i++) {
            if (this.allBlock[i][col] != 0) {
                return i;
            }
        }
        return -1;
    },
    moveUpOneCol: function (col) { //上移一列
        //遍历row行中的每个元素(最后一个除外)
        for (var row = 0; row < 4; row++) {
            //获得下一个不为0的元素的下标
            var nextRow = this.getNextDown(row, col);
            //如果nextCol==-1，移动完成
            if (nextRow == -1) {
                break;
            } else {
                //去0 如果当前元素==0,与下一个!=0的元素交换值
                if (this.allBlock[row][col] == 0) {
                    this.allBlock[row][col] = this.allBlock[nextRow][col];
                    this.allBlock[nextRow][col] = 0;
                    row--;
                } else if (this.allBlock[row][col] == this.allBlock[nextRow][col]) {
                    //合并
                    this.allBlock[row][col] *= 2;
                    this.score += this.allBlock[row][col];
                    this.allBlock[nextRow][col] = 0;
                }
            }
        }
    },

    moveUp: function () { //上移所有行
        if (this.canUp()) { //判断能否上移
            for (var col = 0; col < 4; col++) {
                this.moveUpOneCol(col);
            }
            return true;
        }
    },

    //down
    canDown: function () {
        //遍历每个!=0的元素
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 4; col++) {
                if (this.allBlock[row][col] != 0) {
                    //下侧值==0或者当前值==下侧值,return true
                    if (this.allBlock[row + 1][col] == 0 || this.allBlock[row][col] == this.allBlock[row + 1][col]) {
                        return true;
                    }
                }
            }
        }
        return false; //不能移动
    },
    getNextUp: function (row, col) { //返回上侧第一个!=0的位置下标,否则返回-1
        for (var i = row - 1; i >= 0; i--) {
            if (this.allBlock[i][col] != 0) {
                return i;
            }
        }
        return -1;
    },
    moveDownOneCol: function (col) { //下移一列
        //遍历row行中的每个元素(最后一个除外)
        for (var row = 3; row > 0; row--) {
            //获得下一个不为0的元素的下标
            var prevRow = this.getNextUp(row, col);
            //如果nextCol==-1，移动完成
            if (prevRow == -1) {
                break;
            } else {
                //去0 如果当前元素==0,与上一个!=0的元素交换值
                if (this.allBlock[row][col] == 0) {
                    this.allBlock[row][col] = this.allBlock[prevRow][col];
                    this.allBlock[prevRow][col] = 0;
                    row++;
                } else if (this.allBlock[row][col] == this.allBlock[prevRow][col]) {
                    //合并
                    this.allBlock[row][col] *= 2;
                    this.score += this.allBlock[row][col];
                    this.allBlock[prevRow][col] = 0;
                }
            }
        }
    },

    moveDown: function () { //上移所有行
        if (this.canDown()) { //判断能否上移
            for (var col = 0; col < 4; col++) {
                this.moveDownOneCol(col);
            }
            return true;
        }
    }
}

var block = new Block();
if(localStorage.score > 0){
    game.score = Number(localStorage.score);
    $(".score .score_num span").text(game.score);
}//else game.score = 0;
if (localStorage.best) {
    game.best = Number(localStorage.best);
    $(".best .score_num span").text(game.best);
}//else game.best = 0;
if (localStorage.allBlock) {
    var allBlockTemp = JSON.parse(localStorage.getItem("allBlock"));
    game.allBlock = eval(allBlockTemp);
    block.showBlock();
} else {
    //初始化两个方块
    block.creatBlock();
    block.creatBlock();
}

//屏蔽浏览器滚动
$(document).on('keydown', function (event) {
    if (event.keyCode === 38 || event.keyCode === 40) {
        event.preventDefault();
    }
});
//绑定箭头键的事件
$(document).on('keyup', function (event) {
    //左
    if (event.keyCode === 37) {
        block.left();
    }
    //上
    if (event.keyCode === 38) {
        block.up();
    }
    //右  
    if (event.keyCode === 39) {
        block.right();
    }
    //下
    if (event.keyCode === 40) {
        block.down();
    }
});

//上下左右滑动实现
(function () {

    var LSwiperMaker = function (o) {

        var that = this;
        this.config = o;
        this.control = false;
        this.sPos = {};
        this.mPos = {};
        this.dire;

        this.config.bind.addEventListener('touchstart', function (e) {
            return that.start(e);
        }, false);
        this.config.bind.addEventListener('touchmove', function (e) {
            return that.move(e);
        }, false);
        this.config.bind.addEventListener('touchend', function (e) {
            return that.end(e);
        }, false);

    }

    LSwiperMaker.prototype.start = function (e) {
        var point = e.touches ? e.touches[0] : e;
        this.sPos.x = point.screenX;
        this.sPos.y = point.screenY;

    }
    LSwiperMaker.prototype.move = function (e) {
        e.preventDefault();
        var point = e.touches ? e.touches[0] : e;
        this.control = true;
        this.mPos.x = point.screenX;
        this.mPos.y = point.screenY;
    }

    LSwiperMaker.prototype.end = function (e) {
        if (this.mPos.x > this.sPos.x && (this.mPos.x - this.sPos.x) > 50)
            this.dire = 'r';
        else if (this.mPos.x < this.sPos.x && (this.sPos.x - this.mPos.x) > 50)
            this.dire = 'l';
        else if (this.mPos.y > this.sPos.y && (this.mPos.y - this.sPos.y) > 50)
            this.dire = 'd';
        else if (this.mPos.y < this.sPos.y && (this.sPos.y - this.mPos.y) > 50)
            this.dire = 'u';

        this.control = false;
        this.config.backfn(this);

    }

    window.LSwiperMaker = LSwiperMaker;
    document.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false); // 禁止微信touchmove冲突

}())

//绑定滑动事件
var swipe = new LSwiperMaker({
    bind: document.getElementById("block_container"), // 绑定的DOM对象
    backfn: function (touch) { //回调事件
        if (touch.dire === "l") {
            block.left();
        } else if (touch.dire === "u") {
            block.up();
        } else if (touch.dire === "r") {
            block.right();
        } else if (touch.dire === "d") {
            block.down();
        }
    }
});

//绑定新游戏/再来一次按键
$("#start_game,#restart").on('click', function () {
    block.restart();
})