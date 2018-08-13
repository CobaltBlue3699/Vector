let canvas = document.querySelector('#stage'),
    ctx = canvas.getContext('2d'),
    time = 0,
    balls = [],
    active = false,
    currentPoint = {
        x : canvas.width / 2,
        y : canvas.height / 2
    },
    mouse = {
        x: 0,
        y: 0
    },
    ww = canvas.width = window.innerWidth,
    wh = canvas.height = window.innerHeight;

window.addEventListener("resize",function(){
  ww = canvas.width = window.innerWidth;
  wh = canvas.height = window.innerHeight;
});

// 畫球
function draw (ball) {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

// 清除畫布
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 隨機顏色
function generateColor (isAlpha) {
    if(!isAlpha)
        return '#' + parseInt(Math.random() * (256 * 256 * 256 -1)).toString(16);
    var r = Math.floor(Math.random() * 256); //隨機生成256以內r值
    var g = Math.floor(Math.random() * 256); //隨機生成256以內g值
    var b = Math.floor(Math.random() * 256); //隨機生成256以內b值
    var alpha = Math.random(); //隨機生成1以內a值
    return `rgb(${r},${g},${b},${alpha})`
}

// 畫面更新
function render (t) {
    clear();
    balls.forEach(element => {
        element.motion(t - time, canvas.width, canvas.height);
        // element.motion(t - time);
        draw(element);
    });
    if (active) { // 瞄準中
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.moveTo(currentPoint.x, currentPoint.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
    }
    time = t;
    requestAnimationFrame(render);
}

// 紀錄開始瞄準點
canvas.addEventListener('mousedown', function (e) {
    mouse.x = e.offsetX,
    mouse.y = e.offsetY,
    active = true;
});

// 監控滑鼠座標
canvas.addEventListener('mousemove', function(e) {
    currentPoint.x = e.offsetX;
    currentPoint.y = e.offsetY;
});

// 發射
canvas.addEventListener('mouseup', function(e) {
    let ball = Ball(e.offsetX, e.offsetY, 10, generateColor());
    let mx = e.offsetX - mouse.x,
        my = e.offsetY - mouse.y,
        angle = Math.atan(my / mx),
        force = Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2)) * 10;
        force = mx > 0 ? -force : force;
    let vy = Math.sin(angle) * force,
        vx = Math.cos(angle) * force;
    ball.force(vx, vy);
    balls.push(ball);
    active = false;
    if(balls.length > 50)
        delete balls.splice(0, 1);
});

render();