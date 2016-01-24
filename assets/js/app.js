(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ShapeGraphicsComponent = function(entity) {
  this.entity = entity;
}

ShapeGraphicsComponent.prototype.draw = function(context) {
  console.log('draw');
  context.save();

  context.translate(position.x,position.y);

  context.restore();
}

exports.ShapeGraphicsComponent = ShapeGraphicsComponent;

},{}],2:[function(require,module,exports){
var PhysicsComponent = function(entity) {
    this.entity = entity;

    this.position = {
        x: 0,
        y: 0
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.acceleration = {
        x: 0,
        y: 0
    };
};

PhysicsComponent.prototype.update = function(delta) {
    this.velocity.x += this.acceleration.x * delta;
    this.velocity.y += this.acceleration.y * delta;

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
};

exports.PhysicsComponent = PhysicsComponent;

},{}],3:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/shape");
var physicsComponent = require("../components/physics/physics");

var Shape = function() {
  /*var physics = new physicsComponent.PhysicsComponent(this);
  physics.position.y = 0.5;
  physics.acceleration.y = -0.75;*/

  var graphics = new graphicsComponent.ShapeGraphicsComponent(this);
  this.components = {
    //physics: physics,
    graphics: graphics
  };
}

exports.Shape = Shape;

},{"../components/graphics/shape":1,"../components/physics/physics":2}],4:[function(require,module,exports){
var shape = require('./shape');

function Square() {
  console.log('square');
}

Square.prototype = new shape.Shape();
Square.prototype.constructor = Square;

exports.Square = Square;

},{"./shape":3}],5:[function(require,module,exports){
var tetris = require('./tetris');

document.addEventListener('DOMContentLoaded', function() {
    var app = new tetris.Tetris();
    app.run();
});

},{"./tetris":8}],6:[function(require,module,exports){
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

},{"../entities/square":4}],7:[function(require,module,exports){
var PhysicsSystem = function(entities) {
    this.entities = entities;
    this.interval = null;
};

PhysicsSystem.prototype.run = function() {
    // Run the update loop
    this.interval = window.setInterval(this.tick.bind(this), 1000 /60);
};

PhysicsSystem.prototype.tick = function() {
    for (var i=0; i<this.entities.length; i++) {
        var entity = this.entities[i];
        if (!'physics' in entity.components) continue;

        entity.components.physics.update(1/60);
    }
};

exports.PhysicsSystem = PhysicsSystem;

},{}],8:[function(require,module,exports){
var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
drawAShape = document.getElementById('draw-a-shape');

Math.randomRange = function(min,max) {
  return min + Math.random() * (max-min);
}

var graphicsSystem = require('./systems/graphics');
var phsyicsSystem = require('./systems/phsyics');

var Tetris = function() {
  this.entities = [];
  console.log('tetris');
  this.graphics = new graphicsSystem.GraphicsSystem(this.entities,canvas);
  this.phsyics = new phsyicsSystem.PhysicsSystem(this.entities);
};

Tetris.prototype.run = function() {
  console.log('run');
  this.graphics.run();
  //this.physics.run();
}

exports.Tetris = Tetris;

var shapes = {
  line:[
    0,1,0,0,
    0,1,0,0,
    0,1,0,0,
    0,1,0,0
  ],
  square:[
    0,0,0,0,
    0,1,1,0,
    0,1,1,0,
    0,0,0,0
  ],
  lshape:[
    1,1,0,0,
    0,1,0,0,
    0,1,0,0,
    0,0,0,0
  ],
  jshape:[
    0,1,1,0,
    0,1,0,0,
    0,1,0,0,
    0,0,0,0
  ],
  tee:[
    0,1,0,0,
    1,1,1,0,
    0,0,0,0,
    0,0,0,0
  ],
  zshape:[
    0,1,0,0,
    1,1,0,0,
    1,0,0,0,
    0,0,0,0
  ],
  sshape:[
    1,0,0,0,
    1,1,0,0,
    0,1,0,0,
    0,0,0,0
  ]
};

window.onresize = function() {
  handleResize();
};
handleResize();

function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function step() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();

  ctx.translate(canvas.width/2,canvas.height);
  ctx.scale(canvas.height,-canvas.height);

  ctx.beginPath();

  ctx.translate(0,0.5);

  var possibleShapes = [
    shapes.line,
    shapes.square,
    shapes.lshape,
    shapes.jshape,
    shapes.tee,
    shapes.zshape,
    shapes.sshape
  ];
  drawShape(possibleShapes[Math.round(Math.random() * (possibleShapes.length-1))],0.1);

  function drawShape(tiles,blockSize) {
    blockSize = typeof(blockSize) == 'undefined' ? 0.01 : blockSize;

    ctx.save();
    for(var i = 0; i < tiles.length; i+=4) { // go through the 16 tiles 4 at a time
      (function(tiles){
        ctx.save();
        for(var i = 0; i < tiles.length; i++) {
          if(tiles[i])ctx.fillRect(0, 0, blockSize, blockSize);
          ctx.translate(blockSize,0);
        }
        ctx.restore();
      })(tiles.slice(i,i+3));
      ctx.translate(0,blockSize);
    }
    ctx.restore();
  }

  ctx.restore();
}

window.requestAnimationFrame(step);

drawAShape.addEventListener('click',function(e){
  window.requestAnimationFrame(step);
});

},{"./systems/graphics":6,"./systems/phsyics":7}]},{},[5]);
