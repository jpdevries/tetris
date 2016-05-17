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
  this.entities = [];

  this.graphics = new graphicsSystem.GraphicsSystem(this.entities,canvas);
  this.physics = new physicsSystem.PhysicsSystem(this.entities);
  this.input = new inputSystem.InputSystem(this,canvas);
  this.shapes = new shapeSystem.ShapeSystem(this.entities,canvas);

  this.graphics.on(this.graphics.WOULD_COLLIDE,() => { // es6 arrow function with lexical this
			console.log('WOULD_COLLIDE!!!! 28');
      this.graphics.stop();
      this.graphics.addToWell(this.entities[0]);

      this.entities = this.graphics.entities = this.physics.entities = this.input.entities = this.shapes.entities = [];

      this.graphics.step();
      this.shapes.dropShape();
      //this.graphics.run();
  });
};

Tetris.prototype.run = function() {
  this.graphics.run();
  this.physics.run();
  this.input.run();
  this.shapes.run();
}

exports.Tetris = Tetris;
