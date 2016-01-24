(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ShapeGraphicsComponent = function(entity,tiles,blockSize) {
  this.entity = entity;
  this.tiles = tiles;
  this.blockSize = typeof(blockSize) == 'undefined' ? 0.02 : blockSize;
}

ShapeGraphicsComponent.prototype.draw = function (context) {
  var position = this.entity.components.physics.position;
  var tiles = this.tiles,
  blockSize = this.blockSize;

  context.save();

  context.translate(position.x, position.y);

  for(var i = 0; i < tiles.length; i+=4) { // go through the 16 tiles 4 at a time
    (function(tiles){
      context.save();
      for(var i = 0; i < tiles.length; i++) {
        if(tiles[i]) context.fillRect(0, 0, blockSize, blockSize); // paint tile
        context.translate(blockSize,0); // move to the right (next column)
      }
      context.restore(); // back to the left
    })(tiles.slice(i,i+3)); // slice out the next four blocks and loop through them one by one
    context.translate(0,blockSize); // move down (next row)
  }
  context.restore();
};



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
    //this.velocity.x += this.acceleration.x * delta;
    this.velocity.y += this.acceleration.y * delta;

    //this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
};

exports.PhysicsComponent = PhysicsComponent;

},{}],3:[function(require,module,exports){
var shape = require('./shape');

function JShape() {
  console.log('jshape');
}

JShape.prototype = new shape.Shape([
  0,1,1,0,
  0,1,0,0,
  0,1,0,0,
  0,0,0,0
]);
JShape.prototype.constructor = JShape;

exports.JShape = JShape;

},{"./shape":6}],4:[function(require,module,exports){
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

},{"./shape":6}],5:[function(require,module,exports){
var shape = require('./shape');

function LShape() {
  console.log('lshape');
}

LShape.prototype = new shape.Shape([
  1,1,0,0,
  0,1,0,0,
  0,1,0,0,
  0,0,0,0
]);
LShape.prototype.constructor = LShape;

exports.LShape = LShape;

},{"./shape":6}],6:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/shape");
var physicsComponent = require("../components/physics/physics");

var Shape = function(matrix) {
  var physics = new physicsComponent.PhysicsComponent(this);
  matrix = typeof(matrix) == 'undefined' ? [
    0,0,0,0,
    0,1,1,0,
    0,1,1,0,
    0,0,0,0
  ] : matrix;
  physics.position.y = 1;
  physics.acceleration.y = -0.075;

  console.log('creating a shape');

  this.matrix = matrix;

  var graphics = new graphicsComponent.ShapeGraphicsComponent(this,this.matrix);
  this.components = {
    physics: physics,
    graphics: graphics
  };
}

exports.Shape = Shape;

},{"../components/graphics/shape":1,"../components/physics/physics":2}],7:[function(require,module,exports){
var shape = require('./shape');

function Square() {
  console.log('square');
}

Square.prototype = new shape.Shape();
Square.prototype.constructor = Square;

exports.Square = Square;

},{"./shape":6}],8:[function(require,module,exports){
var shape = require('./shape');

function SShape() {
  console.log('sshape');
}

SShape.prototype = new shape.Shape([
  1,0,0,0,
  1,1,0,0,
  0,1,0,0,
  0,0,0,0
]);
SShape.prototype.constructor = SShape;

exports.SShape = SShape;

},{"./shape":6}],9:[function(require,module,exports){
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

},{"./shape":6}],10:[function(require,module,exports){
var shape = require('./shape');

function ZShape() {
  console.log('zshape');
}

ZShape.prototype = new shape.Shape([
  0,1,0,0,
  1,1,0,0,
  1,0,0,0,
  0,0,0,0
]);
ZShape.prototype.constructor = ZShape;

exports.ZShape = ZShape;

},{"./shape":6}],11:[function(require,module,exports){
var tetris = require('./tetris');

document.addEventListener('DOMContentLoaded', function() {
    var app = new tetris.Tetris();
    app.run();
});

},{"./tetris":14}],12:[function(require,module,exports){
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
  var canvas = this.canvas;
  var ctx = this.context;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(canvas.width/2,canvas.height);
  ctx.scale(canvas.height,-canvas.height);

  for(var i = 0; i < this.entities.length; i++) {
    var entity = this.entities[i];
    if (!'graphics' in entity.components) continue;
    entity.components.graphics.draw(ctx);
  }

  ctx.restore();

  window.requestAnimationFrame(this.tick.bind(this));
}

exports.GraphicsSystem = GraphicsSystem;

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
var canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d'),
drawAShape = document.getElementById('draw-a-shape');

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


Math.randomRange = function(min,max) {
  return min + Math.random() * (max-min);
}

var graphicsSystem = require('./systems/graphics');
var physicsSystem = require('./systems/physics');

var shape = require('./entities/shape');
var jshape = require('./entities/jshape');
var line = require('./entities/line');
var lshape = require('./entities/lshape');
var square = require('./entities/square');
var sshape = require('./entities/sshape');
var tee = require('./entities/tee');
var zshape = require('./entities/zshape');

var Tetris = function() {
  var possibleShapes = [
    new jshape.JShape(),
    new line.Line(),
    new lshape.LShape(),
    new square.Square(),
    new tee.Tee(),
    new zshape.ZShape()
];

  this.entities = [possibleShapes[Math.round(Math.random() * (possibleShapes.length-1))]];
  console.log('tetris');
  this.graphics = new graphicsSystem.GraphicsSystem(this.entities,canvas);
  this.physics = new physicsSystem.PhysicsSystem(this.entities);
};

Tetris.prototype.run = function() {
  console.log('run');
  this.graphics.run();
  this.physics.run();
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

},{"./entities/jshape":3,"./entities/line":4,"./entities/lshape":5,"./entities/shape":6,"./entities/square":7,"./entities/sshape":8,"./entities/tee":9,"./entities/zshape":10,"./systems/graphics":12,"./systems/physics":13}]},{},[11]);
