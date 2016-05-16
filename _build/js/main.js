Math.randomRange = function(min,max) {
  return min + Math.random() * (max-min);
}

Math.degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
}

Math.radiansToDegrees = function(radians) {
  return radians * 180 / Math.PI;
}

var tetris = require('./tetris');

document.addEventListener('DOMContentLoaded', function() {
    var app = new tetris.Tetris();
    app.run();
});
