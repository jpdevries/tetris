var shape = require('./shape');

function JShape() {
  console.log('jshape');
}

JShape.prototype = new shape.Shape([
  0,1,1,0,
  0,1,0,0,
  0,1,0,0,
  0,0,0,0
]);
JShape.prototype.constructor = JShape;

exports.JShape = JShape;
