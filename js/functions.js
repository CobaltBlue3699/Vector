/**
 * Merge defaults with user options
 * @private
 * @param {Object} defaults Default settings
 * @param {Object} options User options
 * @returns {Object} Merged values of defaults and options
 */
var extend = function ( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

if(!Object.prototype.extend) {
    Object.prototype.extend = extend.bind(this, this);
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

function shadeBlend(p,c0,c1) {
    var n=p<0?p*-1:p,u=Math.round,w=parseInt;
    if(c0.length>7){
        var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
        return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
    }else{
        var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
        return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
    }
}

/**
 * 
 * @param {#FFF or rgb(r,g,b)} color 
 * @param {double, 0 to 1} percent 
 * 
 */
function darker(color, percent) {
    return shadeBlend(-percent, color);
}

/**
 * 
 * @param {#FFF or rgb(r,g,b)} color 
 * @param {double, 0 to 1} percent 
 * 
 */
function lighter(color, percent) {
    return shadeBlend(percent, color);
}
