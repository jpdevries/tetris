var square = require('../entities/square');

var GraphicsSystem = function(entities,canvas) {
  this.entities = entities;

  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
}

GraphicsSystem.prototype.run = function() {
    //Run the graphics rendering loop. requestAnimationFrame runs ever 1/60th of a second.
    window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.tick = function() {
  console.log('tick');

  var sq = new square.Square();
}

exports.GraphicsSystem = GraphicsSystem;
