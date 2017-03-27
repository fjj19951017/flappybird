var score = 0;
var bird_drop_interval;
var bird_up_interval;
var pipe_move_interval;
var check_interval;
var speed = 0;

$('.start_btn').click(
    function(e) {
        $('.menu').hide();
        $('.bird').show();
        $('.score').show();
        bird_drop_interval = setInterval(function() {
            if(speed < 2) {
                speed += 0.05;
            }
            drop(speed);
        }, 10);
        createPipe();
        pipe_move_interval = setInterval(createPipe, 3000);
        check_interval = setInterval(check, 10);
        $('.canvas').click(up);
        stopBubble(e);
    }
)

function stopBubble(e) {
    e = e || window.event;
    if(e.stopPropagation) {
        e.stopPropagation();
    }
    else {
        e.cancelBubble = true;
    }
}

function drop(speed) {
    // 下落函数
    var bird = $('.bird')
    bird.offset({ top: bird.offset().top + speed })
}

function up(){
    var upBgm = document.getElementById('up_bgm');
    upBgm.play();
    clearInterval(bird_drop_interval);
    clearInterval(bird_up_interval);
    speed = -2;
    bird_up_interval = setInterval(function() {
        drop(speed);
        speed += 0.05;
        if(speed == 0) {
            clearInterval(bird_up_interval);
            bird_drop_interval = setInterval(function() {
                if(speed < 2) {
                    speed = speed + 0.05;
                }
                drop(speed);
            }, 10);
        }
    },10)
}

function createPipe() {
    //创建几个div，用来装水管
    var upPipe = $('<div class="up_pipe"></div>');
    var upBrick = $('<div class="up_brick"></div>')
    var downPipe = $('<div class="down_pipe"></div>');
    var downBrick = $('<div class="down_brick"></div>');
    //水管随机高度
    var upBrickHeight = (Math.ceil(33 * Math.random()) * 2 + 1) * 3;
    var downBrickHeight = 203 - upBrickHeight;
    //将水管装进去，并将div添加进canvas中
    upPipe.css({ 'background': 'url(images/up_pipe.png) no-repeat', 'top': upBrickHeight });
    downPipe.css({ 'background': 'url(images/down_pipe.png) no-repeat', 'top': 160 + upBrickHeight });
    upBrick.css({ 'height': upBrickHeight, 'background': 'url(images/up_mod.png)' });
    downBrick.css({ 'height': downBrickHeight, 'background': 'url(images/down_mod.png)', 'top': 220 + upBrickHeight });
    $('.canvas').prepend(upBrick, upPipe, downPipe, downBrick);
    //为水管添加移动动画,小鸟穿过水管后分数+1，动画结束后将水管移除
    upPipe.animate({ 'left': '-10px' }, 4380, 'linear', scoreCounter).animate({ 'left': '-62px' }, 642, 'linear', function() {
        upPipe.remove();
    });
    downPipe.animate({ 'left': '-10px' }, 4380, 'linear').animate({ 'left': '-62px' }, 642, 'linear', function() {
        downPipe.remove();
    });
    upBrick.animate({ 'left': '-10px' }, 4380, 'linear').animate({ 'left': '-62px' }, 642, 'linear', function() {
        upBrick.remove();
    });
    downBrick.animate({ 'left': '-10px' }, 4380, 'linear').animate({ 'left': '-62px' }, 642, 'linear', function() {
        downBrick.remove();
    });
}

function scoreCounter() {
    // 计分板
    score = parseInt(score);
    score++;
    score = String(score);
    score = score.split('');
    for(var i = 0; i < score.length; i++) {
        var img_src = "images/" + score[i] + ".jpg";
        $('.sub_score').eq(i).replaceWith(`<div class="sub_score"><img src='${img_src}'></div>`)
    }
    score = score.join('');
}

function check() {
    //碰撞检测
    var bird = $('.bird');
    var upPipe = $('.up_pipe');
    var downPipe = $('.down_pipe');
    var position = bird.position();
    if(position.top >= 393 || position.top <= 0 ) {
        gameOver();
        return;
    }
    for(var i = 0; i < upPipe.length; i++) {
        if(position.top < $('.up_pipe').eq(i).position().top + 60
            && position.left > $('.up_pipe').eq(i).position().left - 40
            && position.left < $('.up_pipe').eq(i).position().left + 62) {
            gameOver();
            return;
        }
    }
    for(i = 0; i < downPipe.length; i++) {
        if(position.top > $('.down_pipe').eq(i).position().top - 30
            && position.left > $('.down_pipe').eq(i).position().left - 40
            && position.left < $('.down_pipe').eq(i).position().left + 62) {
            gameOver();
            return;
        }
    }

}

function gameOver() {
    var crashBgm = document.getElementById('crash_bgm');
    crashBgm.play();
    clearInterval(bird_drop_interval);
    clearInterval(bird_up_interval);
    clearInterval(pipe_move_interval);
    clearInterval(check_interval);
    $('.up_pipe, .up_brick, .down_pipe, .down_brick').stop(true);
    $('.bird').css({ 'animation': 'none' });
    $('.game_over').show();
    $('.slider').hide();
}
