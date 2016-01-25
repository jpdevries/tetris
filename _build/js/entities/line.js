var shape = require('./shape');

function Line() {
}

Line.prototype = new shape.Shape([
  [
    0,1,0,0,
    0,1,0,0,
    0,1,0,0,
    0,1,0,0
  ],
  [
    0,0,0,0,
    1,1,1,1,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,0,1,0,
    0,0,1,0,
    0,0,1,0,
    0,0,1,0
  ],
  [
    0,0,0,0,
    0,0,0,0,
    1,1,1,1,
    0,0,0,0
  ]
]);
Line.prototype.constructor = Line;

exports.Line = Line;
