/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

// Initialize
(function() {

    // Configs

    var BACKGROUND_COLOR      = 'rgba(11, 51, 56, 1)',
        DEFAULT_RADIUS        = 10,
        TIME                  = 0;


    // Vars

    var canvas, context,
        bufferCvs, bufferCtx,
        screenWidth, screenHeight,
        grad,
        gui, control,
        balls = [],
        isAim = false, //是否瞄準中
        currentPoint = Vector();
        mouse = Vector();

    // Event Listeners

    function resize(e) {
        screenWidth  = canvas.width  = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;
        bufferCvs.width  = screenWidth;
        bufferCvs.height = screenHeight;
        context   = canvas.getContext('2d');
        bufferCtx = bufferCvs.getContext('2d');

        var cx = canvas.width * 0.5,
            cy = canvas.height * 0.5;

        grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    }

    function mouseMove(e) {
        currentPoint.set(e.offsetX, e.offsetY);
        //canvas.style.cursor = hit ? 'pointer' : 'default';
    }

    function mouseDown(e) {
        mouse.set(e.offsetX, e.offsetY);
        isAim = true;
    }

    function mouseUp(e) {
        let ball = Ball(e.offsetX, e.offsetY, DEFAULT_RADIUS, generateColor()),
            angle = ball.angleTo(mouse),
            force = ball.distanceTo(mouse) * 10,
            vy = Math.sin(angle) * force,
            vx = Math.cos(angle) * force;
        ball.force(vx, vy);
        balls.push(ball);
        isAim = false;
    }

    function doubleClick(e) {
        
    }


    // Functions

    function addParticle(num) {
        // var i, p;
        // for (i = 0; i < num; i++) {
        //     p = new Particle(
        //         Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
        //         Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
        //         PARTICLE_RADIUS
        //     );
        //     p.addSpeed(Vector.random());
        //     particles.push(p);
        // }
    }

    function removeParticle(num) {
        
    }

    // 清除畫布
    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 畫球
    function drawBall (ball) {
        context.save();

        context.fillStyle = ball.color;
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }

    // 畫線
    function drawLine (pointA, pointB, style) {
        context.save();

        context.beginPath();
        context.strokeStyle = style.color || 'white';
        if(style.lineDash) //[5, 15]
            context.setLineDash(style.lineDash); 
        context.lineWidth = style.lineWidth || 4;
        context.moveTo(pointA.x, pointA.y);
        context.lineTo(pointB.x, pointB.y);
        context.stroke();

        context.restore();
    }

    // 角度換算弧度
    function convertAngleToRadian(angle) {
        return angle * Math.PI / 180;
    }

    // 弧度換算角度
    function convertRadianToAngle(radian) {
        return radian * 180 / Math.PI;
    }

    // GUI Control

    control = {
        graverty: 5,
        friction: 0.8
    };


    // Init

    canvas  = document.getElementById('canvas');
    bufferCvs = document.createElement('canvas');

    window.addEventListener('resize', resize, false);
    resize(null);

    // addParticle(control.particleNum);

    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('dblclick', doubleClick, false);


    // GUI

    gui = new dat.GUI();
    gui.add(control, 'graverty', -10, 10).step(1).name('graverty').onChange(function(data) {
        Ball.setGraverty(data);
    });
    gui.add(control, 'friction', 0.0, 1.0).step(.1).name('friction').onChange(function(data) {
        Ball.setFriction(data);
    });
    gui.close();


    // Start Update

    var loop = function(t) {
        var i, len, ball, p;
        // clear();
        context.save();
        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.fillStyle = grad;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();

        balls.forEach(element => {
            element.motion(t - TIME, canvas.width, canvas.height);
            // element.motion(t - time); // (會跑出去)
            drawBall(element);
        });
        if (isAim) { // 瞄準中
            drawLine(currentPoint, mouse, {
                color : 'white',
                lineDash: [5, 15],
                lineWidth : 5
            });
            // let mx = currentPoint.x - mouse.x,
            //     my = currentPoint.y - mouse.y,
            //     angle = Math.atan(my / mx);
        }
        TIME = t;
        requestAnimationFrame(loop);
    };
    loop();

})();

