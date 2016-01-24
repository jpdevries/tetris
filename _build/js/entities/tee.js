var shape = require('./shape');

function Tee() {
  console.log('tee');
}

Tee.prototype = new shape.Shape([
  0,1,0,0,
  1,1,1,0,
  0,0,0,0,
  0,0,0,0
]);
Tee.prototype.constructor = Tee;

exports.Tee = Tee;
