/**
 * Vector 向量
 */
;( function (global, factory) {
    // For CommonJS and CommonJS-like environments where a proper window is present,
	// execute the factory 
    if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory( global, true );
	} else {
		factory( global );
    }
    
// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( global, noGlobal ) {
    
    var Vector = function(x, y) {
        return new Vector.init(x, y);
    }

    Vector.prototype = {

        set: function(x, y) {
            if (typeof x === 'object') {
                y = x.y;
                x = x.x;
            }
            this.x = x || 0;
            this.y = y || 0;
            return this;
        },
    
        add: function(v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },
    
        sub: function(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
    
        scale: function(s) {
            this.x *= s;
            this.y *= s;
            return this;
        },
    
        length: function() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
    
        lengthSq: function() {
            return this.x * this.x + this.y * this.y;
        },
        
        // 單位向量(正規化向量)
        normalize: function() {
            var m = this.length();//Math.sqrt(this.x * this.x + this.y * this.y);
            if (m) {
                this.x /= m;
                this.y /= m;
            }
            return this;
        },
        
        angle: function() {
            return Math.atan2(this.y , this.x);
        },
        
        angleTo: function(v) {
            var dx = v.x - this.x,
                dy = v.y - this.y;
            return Math.atan2(dy , dx);
        },

        // angle: function() {
        //     return Math.atan(this.y / this.x);
        // },
        
        // angleTo: function(v) {
        //     var dx = v.x - this.x,
        //         dy = v.y - this.y;
        //     return Math.atan(dy / dx);
        // },
    
        distanceTo: function(v) {
            var dx = v.x - this.x,
                dy = v.y - this.y;
            return Math.sqrt(dx * dx + dy * dy);
        },
    
        distanceToSq: function(v) {
            var dx = v.x - this.x,
                dy = v.y - this.y;
            return dx * dx + dy * dy;
        },
        
        // for x1, y1 To x2, y2 spend t time
        lerp: function(v, t) {
            this.x += (v.x - this.x) * t;
            this.y += (v.y - this.y) * t;
            return this;
        },
    
        clone: function() {
            return Vector(this.x, this.y);
        },
    
        toString: function() {
            return '(x:' + this.x + ', y:' + this.y + ')';
        }

    };

    Vector.init = function (x, y) {
        var self = this;
        self.x = x;
        self.y = y;
    }

    Vector.add = function(a, b) {
        return Vector(a.x + b.x, a.y + b.y);
    };
    
    Vector.sub = function(a, b) {
        return Vector(a.x - b.x, a.y - b.y);
    };
    
    Vector.scale = function(v, s) {
        return v.clone().scale(s);
    };
    
    Vector.random = function() {
        return Vector(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        );
    };

    Vector.init.prototype = Vector.prototype;

    global.Vector = global.$V = Vector;
}));



