var shape = require('./shape');

function TShape() {
}

TShape.prototype = new shape.Shape([
  [
    1,1,1,0,
    0,1,0,0,
    0,1,0,0,
    0,1,0,0
  ],
  [
    0,0,0,1,
    1,1,1,1,
    0,0,0,1,
    0,0,0,0
  ],
  [
    0,1,0,0,
    0,1,0,0,
    0,1,0,0,
    1,1,1,0
  ],
  [
    1,0,0,0,
    1,1,1,1,
    1,0,0,0,
    0,0,0,0
  ]
]);
TShape.prototype.constructor = TShape;

exports.TShape = TShape;
