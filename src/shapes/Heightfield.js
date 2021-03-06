var Shape = require('./Shape')
,    vec2 = require('../math/vec2')
,    Utils = require('../utils/Utils');

module.exports = Heightfield;

/**
 * Heightfield shape class. Height data is given as an array. These data points are spread out evenly with a distance "elementWidth".
 * @class Heightfield
 * @extends Shape
 * @constructor
 * @param {Array} data
 * @param {Number} maxValue
 * @param {Number} elementWidth
 * @todo Should take maxValue as an option and also be able to compute it itself if not given.
 * @todo Should be possible to use along all axes, not just y
 */
function Heightfield(data, options){
    options = Utils.defaults(options, {
        maxValue : null,
        minValue : null,
        elementWidth : 0.1
    });

    if(options.minValue === null || options.maxValue === null){
        options.maxValue = data[0];
        options.minValue = data[0];
        for(var i=0; i !== data.length; i++){
            var v = data[i];
            if(v > options.maxValue){
                options.maxValue = v;
            }
            if(v < options.minValue){
                options.minValue = v;
            }
        }
    }

    /**
     * An array of numbers, or height values, that are spread out along the x axis.
     * @property {array} data
     */
    this.data = data;

    /**
     * Max value of the data
     * @property {number} maxValue
     */
    this.maxValue = options.maxValue;

    /**
     * Max value of the data
     * @property {number} minValue
     */
    this.minValue = options.minValue;

    /**
     * The width of each element
     * @property {number} elementWidth
     */
    this.elementWidth = options.elementWidth;

    Shape.call(this,Shape.HEIGHTFIELD);
}
Heightfield.prototype = new Shape();

/**
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number}
 */
Heightfield.prototype.computeMomentOfInertia = function(mass){
    return Number.MAX_VALUE;
};

Heightfield.prototype.updateBoundingRadius = function(){
    this.boundingRadius = Number.MAX_VALUE;
};

Heightfield.prototype.updateArea = function(){
    var data = this.data,
        area = 0;
    for(var i=0; i<data.length-1; i++){
        area += (data[i]+data[i+1]) / 2 * this.elementWidth;
    }
    this.area = area;
};

/**
 * @method computeAABB
 * @param  {AABB}   out      The resulting AABB.
 * @param  {Array}  position
 * @param  {Number} angle
 */
Heightfield.prototype.computeAABB = function(out, position, angle){
    // Use the max data rectangle
    out.upperBound[0] = this.elementWidth * this.data.length + position[0];
    out.upperBound[1] = this.maxValue + position[1] + this.contactSkinSize;
    out.lowerBound[0] = position[0];
    out.lowerBound[1] = -Number.MAX_VALUE; // Infinity
};
