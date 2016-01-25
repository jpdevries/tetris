Math.randomRange = function(min,max) {
  return min + Math.random() * (max-min);
}

Math.degreesToRadians = function(degrees) {
  return degrees * Math.PI / 180;
}

Math.radiansToDegrees = function(radians) {
  return radians * 180 / Math.PI;
}

var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
drawAShape = document.getElementById('draw-a-shape');

var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');
var inputSystem = require('./systems/input');
var shapeSystem = require('./systems/shape_system');

var shape = require('./entities/shape');
var jshape = require('./entities/jshape');
var line = require('./entities/line');
var lshape = require('./entities/lshape');
var square = require('./entities/square');
var sshape = require('./entities/sshape');
var tee = require('./entities/tee');
var zshape = require('./entities/zshape');

var Tetris = function() {
  //this.currentShape = possibleShapes[Math.round(Math.random() * (possibleShapes.length-1))];
  this.entities = [];

  this.graphics = new graphicsSystem.GraphicsSystem(this.entities,canvas);
  this.physics = new physicsSystem.PhysicsSystem(this.entities);
  this.input = new inputSystem.InputSystem(this,canvas);
  this.shapes = new shapeSystem.ShapeSystem(this.entities,canvas);
};

Tetris.prototype.run = function() {
  this.graphics.run();
  this.physics.run();
  this.input.run();
  this.shapes.run();
}

exports.Tetris = Tetris;

window.onresize = function() {
  handleResize();
};
handleResize();

function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
