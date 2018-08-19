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

    const graverty = 5, // 重力
          friction = 0.8,  // 摩擦力
          defaultColor = 'white';
    var Ball = function(x, y, radius, color) {
        return new Ball.init(x, y, radius, color);
    }
    
    Ball.prototype = {
        // 重力 Ay = Ay0 + G
        // 反作用力 V = -V
        // 摩擦力 V = V0 * F
        // V = V0 + AT
        // X0 = X0 + VT 
        // F = ma => F 表示物體所受淨外力，m為物體質量, a 為物體的加速度。
        
        motion : function (offset, width, height) {
            offset = offset || 60;
            let timeOff = offset / 1000,
                right = width - this.radius, 
                left = this.radius,
                down = height - this.radius,
                up = this.radius;
            
            this.velocity.x += this.acceleration.x;
            this.position.x += this.velocity.x * timeOff;
            this.acceleration.y += graverty;
            this.velocity.y += this.acceleration.y;
            this.position.y += this.velocity.y * timeOff;
            
            if(height) { // 設有bounds
                if(this.position.y >= down || this.position.y <= up) {
                    this.position.y = this.position.y > down ? down : up;
                    this.velocity.y *= -friction;
                    this.velocity.x *= friction; // 碰到地面都要摩擦力
                    this.acceleration.x *= -friction;
                    this.acceleration.y *= friction;
                }
            }
            if(width) {
                if(this.position.x >= right || this.position.x <= left) {
                    this.position.x = this.position.x < left ? left : right;
                    this.velocity.x *= -friction;
                    this.acceleration.x *= -friction;
                    this.velocity.y *= friction;
                    this.acceleration.y *= friction;
                }
            }
        },
        // 縮放
        scale: function(s) {
            this.radius += s;
        },

        // 初始速度
        force : function (x, y) {
            this.velocity = {
                x : x,
                y : y
            }
        },

        // 加速度
        strike : function(x, y) {
            this.acceleration.x += x;
            this.acceleration.y += y;
        }
    }

    Ball.init = function (x, y, radius, color) {
        var self = this;
        self.position = {
            x : x || 0,
            y : y || 0
        };
        self.velocity = { // 速度
            x : 0,
            y : 0
        };
        self.acceleration = { // 加速度 (1/10 的 V))
            x : self.velocity.x / 10,
            y : self.velocity.y / 10
        }
        self.radius = radius || 5;
        self.color = color || defaultColor;
    }

    Ball.init.prototype = Ball.prototype;

    global.Ball = Ball;

}));
