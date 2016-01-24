var shape = require('./shape');

function Line() {
  console.log('line');
}

Line.prototype = new shape.Shape([
  0,1,0,0,
  0,1,0,0,
  0,1,0,0,
  0,1,0,0
]);
Line.prototype.constructor = Line;

exports.Line = Line;
