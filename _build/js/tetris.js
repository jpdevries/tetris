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
