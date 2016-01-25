var shape = require('./shape');

function Square() {
}

Square.prototype = new shape.Shape();
Square.prototype.constructor = Square;

exports.Square = Square;
