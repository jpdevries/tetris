var shape = require('./shape');

function Square() {
  console.log('square');
}

Square.prototype = new shape.Shape();
Square.prototype.constructor = Square;

exports.Square = Square;
