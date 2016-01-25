var shape = require('./shape');

function LShape() {
}

LShape.prototype = new shape.Shape([
  [
    1,1,0,0,
    0,1,0,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,0,1,0,
    1,1,1,0,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,1,0,0,
    0,1,0,0,
    0,1,1,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    1,1,1,0,
    1,0,0,0,
    0,0,0,0
  ]
]);
LShape.prototype.constructor = LShape;

exports.LShape = LShape;
