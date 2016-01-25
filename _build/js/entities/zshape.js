var shape = require('./shape');

function ZShape() {
}

ZShape.prototype = new shape.Shape([
  [
    0,1,0,0,
    1,1,0,0,
    1,0,0,0,
    0,0,0,0
  ],
  [
    1,1,0,0,
    0,1,1,0,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,0,1,0,
    0,1,1,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    1,1,0,0,
    0,1,1,0,
    0,0,0,0
  ]
]);
ZShape.prototype.constructor = ZShape;

exports.ZShape = ZShape;
