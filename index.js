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

    var BACKGROUND_COLOR      = 'rgba(0, 0, 0, .2)',//'rgba(11, 51, 56, 1)',
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
        currentPoint = {
            x : 0,
            y : 0
        },
        mouse = {
            x: 0,
            y: 0
        };

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
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    }

    function mouseMove(e) {
        currentPoint.x = e.offsetX;
        currentPoint.y = e.offsetY;
        //canvas.style.cursor = hit ? 'pointer' : 'default';
    }

    function mouseDown(e) {
        mouse.x = e.offsetX,
        mouse.y = e.offsetY,
        isAim = true;
    }

    function mouseUp(e) {
        let ball = Ball(e.offsetX, e.offsetY, DEFAULT_RADIUS, generateColor()),
            mx = e.offsetX - mouse.x,
            my = e.offsetY - mouse.y,
            // angle = Math.atan2(e.offsetX, e.offsetY);
            // angle = Math.atan2(mx, my);
            angle = Math.atan(my / mx),
            force = Math.sqrt(Math.pow(mx, 2) + Math.pow(my, 2)) * 10;
            force = mx > 0 ? -force : force;
        let vy = Math.sin(angle) * force,
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
        context.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
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

    // GUI Control

    control = {
        particleNum: 100
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

    // gui = new dat.GUI();
    // gui.add(control, 'particleNum', 0, 500).step(1).name('Particle Num').onChange(function() {
    //     var n = (control.particleNum | 0) - particles.length;
    //     if (n > 0)
    //         addParticle(n);
    //     else if (n < 0)
    //         removeParticle(-n);
    // });
    // gui.add(GravityPoint, 'interferenceToPoint').name('Interference Between Point');
    // gui.close();


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
