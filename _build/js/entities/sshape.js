var shape = require('./shape');

function SShape() {
  console.log('sshape');
}

SShape.prototype = new shape.Shape([
  1,0,0,0,
  1,1,0,0,
  0,1,0,0,
  0,0,0,0
]);
SShape.prototype.constructor = SShape;

exports.SShape = SShape;
