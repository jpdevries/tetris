var shape = require('../entities/shape');
var jshape = require('../entities/jshape');
var line = require('../entities/line');
var lshape = require('../entities/lshape');
var square = require('../entities/square');
var sshape = require('../entities/sshape');
var tee = require('../entities/tee');
var zshape = require('../entities/zshape');

var ShapeSystem = function(entities,canvas) {
  this.entities = entities;
  this.canvas = canvas;
  this.interval = null;
  this.currentShape = null;
}

ShapeSystem.prototype.run = function() {
  this.tick();
};

ShapeSystem.prototype.pause = function() {
  if(this.interval != null) {
    window.clearInterval(this.interval);
    this.interval = null;
  }
}

ShapeSystem.prototype.tick = function() {
  var possibleShapes = [
    new jshape.JShape(),
    new line.Line(),
    new lshape.LShape(),
    new square.Square(),
    new tee.Tee(),
    new zshape.ZShape()
  ];

  var newShape = possibleShapes[Math.round(Math.random() * (possibleShapes.length-1))];
  newShape.components.physics.position.y = 1;

  this.entities.push(newShape);

  this.currentShape = newShape;
};

exports.ShapeSystem = ShapeSystem;
