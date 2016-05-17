(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ShapeGraphicsComponent = function ShapeGraphicsComponent(entity, color, rotation, blockSize) {
  this.entity = entity;
  this.color = typeof color == 'undefined' ? randomColor() : color;
  this.rotation = typeof rotation == 'undefined' ? 0 : rotation;
  this.blockSize = typeof blockSize == 'undefined' ? 1 : blockSize;
  this.rows = [];
};

ShapeGraphicsComponent.prototype.getPosition = function () {
  return this.entity.components.physics.position;
};

ShapeGraphicsComponent.prototype.draw = function (context) {
  var canvas = document.getElementById("canvas");
  var position = this.entity.components.physics.position;

  var tiles = this.entity.getCurrentMatrix(),
      blockSize = this.blockSize,
      color = this.color;

  //console.log(this.entity.matrixIndex);

  context.save();
  context.translate(position.x, position.y);

  var rows = [];

  for (var i = 0; i < tiles.length; i += 4) {
    // go through the 16 tiles 4 at a time
    var row = [];
    (function (tiles, row) {
      context.save();
      for (var i = 0; i < tiles.length; i++) {
        context.fillStyle = tiles[i] ? 'red' : 'pink';
        row.push(tiles[i] ? 1 : 0);
        context.fillRect(0, 0, blockSize, blockSize); // paint tile
        context.translate(blockSize, 0); // move to the right (next column)
      }
      context.restore(); // back to the left
    })(tiles.slice(i, i + 4), row); // slice out the next four blocks and loop through them one by one
    rows.push(row);
    context.translate(0, blockSize); // move down (next row)
  }

  context.restore();

  this.rows = rows;

  return rows;
};

function randomColor() {
  var colors = ['#fee109', '#ff6113', '#0036fb', '#fe0005', '#31cbff', '#38cd00'];

  return colors[Math.round(Math.random() * (colors.length - 1))];
  //return '#'+Math.floor(Math.random()*16777215).toString(16);
}

exports.ShapeGraphicsComponent = ShapeGraphicsComponent;

},{}],2:[function(require,module,exports){
"use strict";

var PhysicsComponent = function PhysicsComponent(entity) {
    this.entity = entity;

    this.position = {
        x: Math.floor(25 / 2),
        y: 25 - 1
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.acceleration = {
        x: 0,
        y: 1
    };
};

PhysicsComponent.prototype.update = function () {
    //this.position.x += this.velocity.x * delta;
    this.position.y = Math.max(this.position.y - 1, -4);
};

exports.PhysicsComponent = PhysicsComponent;

},{}],3:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function JShape() {}

JShape.prototype = new shape.Shape([[0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
JShape.prototype.constructor = JShape;

exports.JShape = JShape;

},{"./shape":6}],4:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function Line() {}

Line.prototype = new shape.Shape([[0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]]);
Line.prototype.constructor = Line;

exports.Line = Line;

},{"./shape":6}],5:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function LShape() {}

LShape.prototype = new shape.Shape([[1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]]);
LShape.prototype.constructor = LShape;

exports.LShape = LShape;

},{"./shape":6}],6:[function(require,module,exports){
"use strict";

var graphicsComponent = require("../components/graphics/shape");
var physicsComponent = require("../components/physics/physics");

var Shape = function Shape(matrices, blockSize) {
  matrices = typeof matrices == 'undefined' ? [[0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0]] : matrices;

  blockSize = typeof blockSize == 'undefined' ? 1 : blockSize;

  this.blockCoords = {
    x: 0,
    y: 0
  };

  var that = this;

  this.matrices = matrices;
  this.matrixIndex = 0;
  this.collided = false;

  this.getCurrentMatrix = function () {
    return that.matrices[that.matrixIndex];
  };

  var physics = new physicsComponent.PhysicsComponent(this);
  //physics.position.y = 25;
  //physics.acceleration.y = -0.075;

  this.blockSize = blockSize;

  var graphics = new graphicsComponent.ShapeGraphicsComponent(this);
  this.components = {
    physics: physics,
    graphics: graphics
  };
  this.rotate = function (amnt) {
    var position = physics.position;
    that.matrixIndex += amnt;

    if (that.matrixIndex > 3) that.matrixIndex = 0;
    //if(!physics.position.y) return;  // once they hit the ground they die
    //this.components.graphics.rotation += amnt;
  };
  this.getPosition = function () {
    return physics.position;
  };
  this.getBlockCoords = function () {
    return that.components.graphics.rows;
  };
  this.translate = function (x, y) {
    that.blockCoords.x += x;
    that.blockCoords.y += y;

    var position = physics.position;
    //if(!position.y) return; // once they hit the ground they die
    position.x += x;
    position.y += y;
  };
};

exports.Shape = Shape;

},{"../components/graphics/shape":1,"../components/physics/physics":2}],7:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function Square() {}

Square.prototype = new shape.Shape();
Square.prototype.constructor = Square;

exports.Square = Square;

},{"./shape":6}],8:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function SShape() {}

SShape.prototype = new shape.Shape([[1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0]]);
SShape.prototype.constructor = SShape;

exports.SShape = SShape;

},{"./shape":6}],9:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function Tee() {}

Tee.prototype = new shape.Shape([[0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]]);
Tee.prototype.constructor = Tee;

exports.Tee = Tee;

},{"./shape":6}],10:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function TShape() {}

TShape.prototype = new shape.Shape([[1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0], [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]]);
TShape.prototype.constructor = TShape;

exports.TShape = TShape;

},{"./shape":6}],11:[function(require,module,exports){
'use strict';

var shape = require('./shape');

function ZShape() {}

ZShape.prototype = new shape.Shape([[0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]]);
ZShape.prototype.constructor = ZShape;

exports.ZShape = ZShape;

},{"./shape":6}],12:[function(require,module,exports){
'use strict';

Math.randomRange = function (min, max) {
  return min + Math.random() * (max - min);
};

Math.degreesToRadians = function (degrees) {
  return degrees * Math.PI / 180;
};

Math.radiansToDegrees = function (radians) {
  return radians * 180 / Math.PI;
};

var tetris = require('./tetris');

document.addEventListener('DOMContentLoaded', function () {
  var app = new tetris.Tetris();
  app.run();
});

},{"./tetris":18}],13:[function(require,module,exports){
'use strict';

var CollisionSystem = function CollisionSystem(well) {
  //console.log('CollisionSystem');
  this.well = well;
  this.interval = null;
  this.WOULD_COLLIDE = 'wouldcollide';
};

CollisionSystem.prototype.wouldCollide = function (position, blocks) {
  // blocks is a two dimensional array (array of arrays)
  // each index of blocks[0-3] contains an array representing a row of four blocks
  // based on the y position of the shape, select the correct row to check for collisions
  if (position.y < 0) {
    // if negative y position shift up accordingly
    blocks = blocks[Math.abs(position.y)];
  } else {
    // otherwise just check the first (bottom) row for collisions
    blocks = blocks[0];
  }

  var well = this.well;

  // the row of the well to check collisions for
  //var r = well[Math.max(position.y-1,0)];
  var r = function () {
    if (position.y > 0) return well[Math.max(position.y - 1, 0)];else {
      // force a "collision" when they hit the bottom
      var a = [];
      for (var i = 0; i < 25; i++) {
        a.push(1);
      }return a;
    }
  }();

  for (var i = position.x; i <= position.x + 4; i++) {
    if (position.x == 12) {
      //console.log(r,i,blocks,i-position.x);
    }
    try {
      if (r[i] && blocks[i - position.x]) return true;
    } catch (e) {}
  }

  return false;
};

exports.CollisionSystem = CollisionSystem;

},{}],14:[function(require,module,exports){
'use strict';

var collisionSystem = require('./collision_system');
var EventEmitter = require('events');
var util = require('util');

var GraphicsSystem = function GraphicsSystem(entities, canvas) {
  var that = this;

  this.blocksPerRow = 25;
  this.blockStep = 1 / this.blocksPerRow;

  this.running = false;

  this.entities = entities;
  this.well = function (blocksPerRow) {
    var well = [];

    for (var i = 0; i < blocksPerRow; i++) {
      well.push(makeRow(false));
    } //i ? false : true

    function makeRow(fill) {
      var r = [];
      for (var i = 0; i < blocksPerRow; i++) {
        r.push(fill ? 'green' : 0);
      }return r;
    }

    return well;
  }(this.blocksPerRow);
  console.log(this.well);
  this.collision = new collisionSystem.CollisionSystem(this.well);

  this.WOULD_COLLIDE = this.collision.WOULD_COLLIDE;
  //this.collisionSystem.run();

  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');

  this.interval = null;

  window.onresize = function () {
    that.handleResize();
  };
  that.handleResize();
};

util.inherits(GraphicsSystem, EventEmitter);

GraphicsSystem.prototype.handleResize = function () {
  this.canvas.width = 650; //window.innerWidth;
  this.canvas.height = 650; //window.innerHeight;
};

GraphicsSystem.prototype.addToWell = function (shape) {
  console.log('addToWell', shape, shape.getPosition(), shape.getBlockCoords());

  var position = shape.getPosition();
  var rows = shape.getBlockCoords();
  var well = this.well;

  var r = 0;
  for (var i = position.y; i < position.y + 4; i++) {
    console.log(i);
    if (i >= 0) {
      //console.log(i,well[i],rows[r]);
      well[i] = function (wellRow, blocks) {
        for (var i = position.x; i < position.x + blocks.length; i++) {
          if (blocks[i - position.x]) wellRow[i] = 'red';
          //console.log(i,wellRow[i],blocks[i-position.x]);
        }
        return wellRow;
      }(well[i], rows[r]);
    }
    r++;
  }
};

GraphicsSystem.prototype.run = function () {
  this.interval = window.setInterval(this.tick.bind(this), 1000 / 12);
  //Run the graphics rendering loop. requestAnimationFrame runs ever 1/60th of a second.
  this.running = true;
  //window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.step = function () {
  this.tick();
};

GraphicsSystem.prototype.stop = function () {
  console.log('stop');
  this.running = false;
  clearInterval(this.interval);
};

GraphicsSystem.prototype.paintWell = function () {
  console.log('paintWell', this.well);
  var canvas = this.canvas;
  var ctx = this.context,
      collision = this.collision;

  var well = this.well;
  var blockSize = 1;

  ctx.save();

  for (var i = 0; i < well.length; i++) {

    (function (wellRow) {
      //console.log(wellRow);
      ctx.save();
      for (var i = 0; i < wellRow.length; i++) {
        //console.log(wellRow[i]);
        if (wellRow[i]) {
          ctx.fillStyle = wellRow[i];
          ctx.fillRect(0, 0, blockSize, blockSize); // paint tile
        }
        ctx.translate(blockSize, 0);
      }
      ctx.restore();
    })(well[i]);

    ctx.translate(0, 1);
  }

  ctx.restore();
};

GraphicsSystem.prototype.tick = function () {

  var canvas = this.canvas;
  var ctx = this.context,
      collision = this.collision;

  //let snapPoint = (point,freq) => (Math.floor(point / freq) * freq) + ((point % freq >= (freq / 2)) ? freq : 0);

  ctx.globalCompositeOperation = "multiply";

  ctx.clearRect(0, 0, canvas.width, canvas.height); // right here

  //ctx.fillStyle = 'orange';
  //ctx.fillRect(canvas.width/2,0,0.02*4 * canvas.height,canvas.height);

  this.paintWell();

  ctx.save();

  ctx.translate(0, canvas.height);
  ctx.scale(canvas.height / this.blocksPerRow, -canvas.height / this.blocksPerRow);

  ctx.globalCompositeOperation = 'difference';

  //ctx.fillStyle = 'green';
  //ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
  //ctx.fillRect(0,0,this.blocksPerRow,1);

  for (var i = 0; i < this.entities.length; i++) {
    var entity = this.entities[i];
    if (!'graphics' in entity.components) continue;
    var blocks = entity.components.graphics.draw(ctx);
    var position = entity.getPosition();

    //console.log(position);

    //console.log('blocks',blocks);
    //console.log(blocks);
    var wouldCollide = collision.wouldCollide(position, blocks);
    if (wouldCollide || position.y < -5) {
      //console.log('COLLIDE!');
      this.emit(collision.WOULD_COLLIDE);
    }
  }

  ctx.restore();
};

exports.GraphicsSystem = GraphicsSystem;

},{"./collision_system":13,"events":19,"util":23}],15:[function(require,module,exports){
'use strict';

var InputSystem = function InputSystem(tetris, canvas) {
  this.tetris = tetris;
  this.entities = tetris.entities;
  this.canvas = canvas;
};

InputSystem.prototype.run = function () {
  this.canvas.addEventListener('click', this.onClick.bind(this));
  document.body.addEventListener('keydown', this.onkeydown.bind(this));
  document.body.addEventListener('keyup', this.onkeyup.bind(this));
};

InputSystem.prototype.onClick = function () {
  this.tetris.shapes.currentShape.rotate(1);
};

InputSystem.prototype.onkeydown = function (e) {
  console.log('keydown');

  switch (e.keyCode) {
    case 38:
      // top
      this.onClick();
      break;

    case 39:
      // right
      this.tetris.shapes.currentShape.translate(1, 0);
      break;

    case 40:
      // bottom
      this.tetris.shapes.currentShape.components.physics.acceleration.y = 2;
      break;

    case 37:
      // left
      this.tetris.shapes.currentShape.translate(-1, 0);
      break;
  }
};

InputSystem.prototype.onkeyup = function (e) {
  this.tetris.shapes.currentShape.components.physics.acceleration.y = 1;
};

exports.InputSystem = InputSystem;

},{}],16:[function(require,module,exports){
'use strict';

var PhysicsSystem = function PhysicsSystem(entities) {
    this.entities = entities;
    this.interval = null;
};

PhysicsSystem.prototype.run = function () {
    // Run the update loop
    this.interval = window.setInterval(this.tick.bind(this), 1000 / 12);
};

PhysicsSystem.prototype.tick = function () {
    //this.entities.filter(function(val) { return val !== null; }).join(", ");
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if (!entity || !'physics' in entity.components || entity.collided) continue;

        entity.components.physics.update();
    }
};

exports.PhysicsSystem = PhysicsSystem;

},{}],17:[function(require,module,exports){
'use strict';

var shape = require('../entities/shape');
var jshape = require('../entities/jshape');
var line = require('../entities/line');
var lshape = require('../entities/lshape');
var square = require('../entities/square');
var sshape = require('../entities/sshape');
var tshape = require('../entities/tshape');
var tee = require('../entities/tee');
var zshape = require('../entities/zshape');

var ShapeSystem = function ShapeSystem(entities, canvas) {
  this.entities = entities;
  this.canvas = canvas;
  this.interval = null;
  this.currentShape = null;
};

ShapeSystem.prototype.run = function () {
  this.dropShape();
};

ShapeSystem.prototype.dropShape = function () {
  this.tick();
};

ShapeSystem.prototype.pause = function () {
  if (this.interval != null) {
    window.clearInterval(this.interval);
    this.interval = null;
  }
};

ShapeSystem.prototype.tick = function () {
  var possibleShapes = [new jshape.JShape(), new line.Line(), new lshape.LShape(), new square.Square(), new tee.Tee(), new zshape.ZShape(), new tshape.TShape()];

  var newShape = possibleShapes[Math.round(Math.random() * (possibleShapes.length - 1))];
  //newShape.components.physics.position.y = 24;

  this.entities.push(newShape);

  this.currentShape = newShape;
};

exports.ShapeSystem = ShapeSystem;

},{"../entities/jshape":3,"../entities/line":4,"../entities/lshape":5,"../entities/shape":6,"../entities/square":7,"../entities/sshape":8,"../entities/tee":9,"../entities/tshape":10,"../entities/zshape":11}],18:[function(require,module,exports){
'use strict';

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

var Tetris = function Tetris() {
  var _this = this;

  this.entities = [];

  this.graphics = new graphicsSystem.GraphicsSystem(this.entities, canvas);
  this.physics = new physicsSystem.PhysicsSystem(this.entities);
  this.input = new inputSystem.InputSystem(this, canvas);
  this.shapes = new shapeSystem.ShapeSystem(this.entities, canvas);

  this.graphics.on(this.graphics.WOULD_COLLIDE, function () {
    // es6 arrow function with lexical this
    console.log('WOULD_COLLIDE!!!! 28');
    _this.graphics.stop();
    _this.graphics.addToWell(_this.entities[0]);

    _this.entities = _this.graphics.entities = _this.physics.entities = _this.input.entities = _this.shapes.entities = [];

    _this.graphics.step();
    _this.shapes.dropShape();
    //this.graphics.run();
  });
};

Tetris.prototype.run = function () {
  this.graphics.run();
  this.physics.run();
  this.input.run();
  this.shapes.run();
};

exports.Tetris = Tetris;

},{"./entities/jshape":3,"./entities/line":4,"./entities/lshape":5,"./entities/shape":6,"./entities/square":7,"./entities/sshape":8,"./entities/tee":9,"./entities/zshape":11,"./systems/graphics":14,"./systems/input":15,"./systems/physics":16,"./systems/shape_system":17}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],20:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],21:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],22:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],23:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":22,"_process":21,"inherits":20}]},{},[12]);
