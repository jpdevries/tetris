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
