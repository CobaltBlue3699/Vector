;( function (global, Vector, factory) {

    // For CommonJS and CommonJS-like environments where a proper window is present,
	// execute the factory 
    if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = global.document ?
			factory( global, Vector, true ) :
			function( w, Vector ) {
				if ( !w.document ) {
					throw new Error( "This requires a window with a document" );
				}
				return factory( w, Vector );
			};
	} else {
		factory( global, Vector );
	}
    
// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, Vector, function( global, Vector, noGlobal ) {

    let graverty = 5, // 重力
        friction = 0.8,  // 摩擦力
        defaultColor = 'white';
    var Ball = function(x, y, radius, color) {
        return new Ball.init(x, y, radius, color);
    }
    
    Ball.prototype = (function (o) { // Ball.x .y -> position
        var s = Vector(0, 0), p;
        for (p in o) s[p] = o[p];
        return s;
    }({
        // 重力 Ay = Ay0 + G
        // 反作用力 V = -V
        // 摩擦力 V = V0 * F
        // V = V0 + AT
        // X0 = X0 + VT 
        // F = ma => F 表示物體所受淨外力，m為物體質量, a 為物體的加速度。
        
        motion : function (offset, width, height) {
            offset = offset || 60;
            let timeOff = offset / 1000,
                g = Vector(0, graverty),
                right = width - this.radius, 
                left = this.radius,
                down = height - this.radius,
                up = this.radius;
            
            // 加上重力
            this.acceleration.add(g);
            // 速度 加上 速度(外來)
            this.velocity.add(this.acceleration);
            // 位移
            this.add(Vector.scale(this.velocity, timeOff));

            if(height) { // 設有bounds
                if(this.y >= down || this.y <= up) {
                    this.y = this.y > down ? down : up;
                    // this.velocity.scale(f);
                    // this.acceleration.scale(f);
                    this.velocity.y *= -friction;
                    this.velocity.x *= friction; // 碰到地面都要摩擦力
                    this.acceleration.x *= -friction;
                    this.acceleration.y *= friction;
                }
            }
            if(width) {
                if(this.x >= right || this.x <= left) {
                    this.x = this.x < left ? left : right;
                    this.velocity.x *= -friction;
                    this.acceleration.x *= -friction;
                    this.velocity.y *= friction;
                    this.acceleration.y *= friction;
                }
            }
        },
        // 縮放
        scale: function(s) {
            this.radius *= s;
            return this;
        },

        // 初始速度
        force : function (x, y) {
            this.velocity.set(x, y);
            return this;
        },

        // 加速度
        strike : function(x, y) {
            this.acceleration.add(Vector(x, y));
            return this;
        },

        //是否撞擊
        testHit : function (v) {
            return this.distanceTo(v) < this.radius;
        }
    }));

    Ball.init = function (x, y, radius, color) {
        var self = this;
        self.set(x,y);
        // 速度
        self.velocity = Vector(0, 0);
        // 加速度
        self.acceleration = Vector.scale(self.velocity, .1); 
        self.radius = radius || 5;
        self.color = color || defaultColor;
    }

    Ball.setGraverty = function (g) {
        graverty = g;
    }

    Ball.setFriction = function (f) {
        friction = f;
    }

    Ball.init.prototype = Ball.prototype;

    global.Ball = Ball;

}));

