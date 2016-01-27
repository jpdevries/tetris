(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ShapeGraphicsComponent = function(entity,color,rotation,blockSize) {
  this.entity = entity;
  this.color = typeof(color)  == 'undefined' ? randomColor() : color;
  this.rotation = typeof(rotation) == 'undefined' ? 0 : rotation;
  this.blockSize = typeof(blockSize) == 'undefined' ? 0.02 : blockSize;
}

ShapeGraphicsComponent.prototype.draw = function (context) {
  var canvas = document.getElementById("canvas");
  var position = this.entity.components.physics.position;

  var tiles = this.entity.getCurrentMatrix(),
  blockSize = this.blockSize,
  color = this.color;

  //console.log(this.entity.matrixIndex);

  context.save();

  context.translate(position.x-(0.02*2), position.y);

  //context.translate(position.x, position.y+(blockSize*2));
  //context.rotate(Math.degreesToRadians(this.rotation));
  //context.translate(-blockSize*2,-blockSize*2);

  for(var i = 0; i <= tiles.length-4; i+=4) { // go through the 16 tiles 4 at a time
    (function(tiles){
      context.save();
      for(var i = 0; i < tiles.length; i++) {
        context.fillStyle = (tiles[i]) ? color : 'transparent';
        if((tiles[i])) context.fillRect(0, 0, blockSize, blockSize); // paint tile
        context.translate(blockSize,0); // move to the right (next column)
      }
      context.restore(); // back to the left
    })(tiles.slice(i,i+4)); // slice out the next four blocks and loop through them one by one
    context.translate(0,blockSize); // move down (next row)
  }





  //context.translate(0,-blockSize*2);
  //context.rotate(Math.degreesToRadians(this.rotation));

  context.restore();


};

function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
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
        y: 1
    };
};

PhysicsComponent.prototype.update = function() {

    //this.position.x += this.velocity.x * delta;
    this.position.y = Math.max(-.02*4,this.position.y - (.02*this.acceleration.y));
};

exports.PhysicsComponent = PhysicsComponent;

},{}],3:[function(require,module,exports){
var shape = require('./shape');

function JShape() {

}

JShape.prototype = new shape.Shape([
  [
    0,1,1,0,
    0,1,0,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    1,1,1,0,
    0,0,1,0,
    0,0,0,0
  ],
  [
    0,1,0,0,
    0,1,0,0,
    1,1,0,0,
    0,0,0,0
  ],[
    1,0,0,0,
    1,1,1,0,
    0,0,0,0,
    0,0,0,0
  ]
]);
JShape.prototype.constructor = JShape;

exports.JShape = JShape;

},{"./shape":6}],4:[function(require,module,exports){
var shape = require('./shape');

function Line() {
}

Line.prototype = new shape.Shape([
  [
    0,1,0,0,
    0,1,0,0,
    0,1,0,0,
    0,1,0,0
  ],
  [
    0,0,0,0,
    1,1,1,1,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,0,1,0,
    0,0,1,0,
    0,0,1,0,
    0,0,1,0
  ],
  [
    0,0,0,0,
    0,0,0,0,
    1,1,1,1,
    0,0,0,0
  ]
]);
Line.prototype.constructor = Line;

exports.Line = Line;

},{"./shape":6}],5:[function(require,module,exports){
var shape = require('./shape');

function LShape() {
}

LShape.prototype = new shape.Shape([
  [
    1,1,0,0,
    0,1,0,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,0,1,0,
    1,1,1,0,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,1,0,0,
    0,1,0,0,
    0,1,1,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    1,1,1,0,
    1,0,0,0,
    0,0,0,0
  ]
]);
LShape.prototype.constructor = LShape;

exports.LShape = LShape;

},{"./shape":6}],6:[function(require,module,exports){
var graphicsComponent = require("../components/graphics/shape");
var physicsComponent = require("../components/physics/physics");

var Shape = function(matrices,blockSize) {
  matrices = typeof(matrices) == 'undefined' ? [
    [
      0,0,0,0,
      0,1,1,0,
      0,1,1,0,
      0,0,0,0
    ],
    [
      0,0,0,0,
      0,1,1,0,
      0,1,1,0,
      0,0,0,0
    ],
    [
      0,0,0,0,
      0,1,1,0,
      0,1,1,0,
      0,0,0,0
    ],
    [
      0,0,0,0,
      0,1,1,0,
      0,1,1,0,
      0,0,0,0
    ]
  ] : matrices;

  blockSize = typeof(blockSize) == 'undefined' ? 0.02 : blockSize;

  var that = this;

  this.matrices = matrices;
  this.matrixIndex = 0;

  this.getCurrentMatrix = function() {
    return that.matrices[that.matrixIndex];
  }

  var physics = new physicsComponent.PhysicsComponent(this);
  physics.position.y = 1;
  //physics.acceleration.y = -0.075;

  this.blockSize = blockSize;

  var graphics = new graphicsComponent.ShapeGraphicsComponent(this);
  this.components = {
    physics: physics,
    graphics: graphics
  };
  this.rotate = function(amnt) {
    var position = physics.position;
    that.matrixIndex += amnt;

    if(that.matrixIndex > 3) that.matrixIndex = 0;
    //if(!physics.position.y) return;  // once they hit the ground they die
    //this.components.graphics.rotation += amnt;

  }
  this.translate = function(x,y) {
    var position = physics.position;
    //if(!position.y) return; // once they hit the ground they die
    position.x += x*blockSize;
    position.y += y*blockSize;
  }
}

exports.Shape = Shape;

},{"../components/graphics/shape":1,"../components/physics/physics":2}],7:[function(require,module,exports){
var shape = require('./shape');

function Square() {
}

Square.prototype = new shape.Shape();
Square.prototype.constructor = Square;

exports.Square = Square;

},{"./shape":6}],8:[function(require,module,exports){
var shape = require('./shape');

function SShape() {
}

SShape.prototype = new shape.Shape([
  [
    1,0,0,0,
    1,1,0,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,1,1,0,
    1,1,0,0,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,1,0,0,
    0,1,1,0,
    0,0,1,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    0,1,1,0,
    1,1,0,0,
    0,0,0,0
  ]
]);
SShape.prototype.constructor = SShape;

exports.SShape = SShape;

},{"./shape":6}],9:[function(require,module,exports){
var shape = require('./shape');

function Tee() {
}

Tee.prototype = new shape.Shape([
  [
    0,1,0,0,
    1,1,1,0,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,1,0,0,
    0,1,1,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    1,1,1,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,1,0,0,
    1,1,0,0,
    0,1,0,0,
    0,0,0,0
  ]
]);
Tee.prototype.constructor = Tee;

exports.Tee = Tee;

},{"./shape":6}],10:[function(require,module,exports){
var shape = require('./shape');

function ZShape() {
}

ZShape.prototype = new shape.Shape([
  [
    0,1,0,0,
    1,1,0,0,
    1,0,0,0,
    0,0,0,0
  ],
  [
    1,1,0,0,
    0,1,1,0,
    0,0,0,0,
    0,0,0,0
  ],
  [
    0,0,1,0,
    0,1,1,0,
    0,1,0,0,
    0,0,0,0
  ],
  [
    0,0,0,0,
    1,1,0,0,
    0,1,1,0,
    0,0,0,0
  ]
]);
ZShape.prototype.constructor = ZShape;

exports.ZShape = ZShape;

},{"./shape":6}],11:[function(require,module,exports){
var tetris = require('./tetris');

document.addEventListener('DOMContentLoaded', function() {
    var app = new tetris.Tetris();
    app.run();
});

},{"./tetris":16}],12:[function(require,module,exports){
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

  ctx.globalCompositeOperation = "multiply";

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //ctx.fillStyle = 'orange';
  //ctx.fillRect(canvas.width/2,0,0.02*4 * canvas.height,canvas.height);

  ctx.save();

  ctx.translate(canvas.width/2,canvas.height);
  ctx.scale(canvas.height,-canvas.height);

  var offscreen = document.getElementById('offscreen'),
  offscreenContext = offscreen.getContext('2d');



  for(var i = 0; i < this.entities.length; i++) {

    var entity = this.entities[i];
    if (!'graphics' in entity.components) continue;
    var position = entity.components.physics.position;

    drawWell();

    var cut = { // getImageData ignores the transformation coordinates so we have to convert our custom units back to px
      x: Math.ceil(canvas.width/2-((.02*2) * canvas.height-(position.x*canvas.height))),
      y: Math.ceil(canvas.height-(((.02 * (4-0))+position.y)*canvas.height)),
      w: Math.ceil(0.02*4 * canvas.height),
      h: Math.ceil((.02*4)*canvas.height)
    };

    var well = (function(){ // slice out the portion of our well that falls within the bounding box of the shape, if any
      var imgData = ctx.getImageData(cut.x,cut.y,cut.w,cut.h);
      return imgData;
    })();

    ctx.clearRect(-1, 0, 2, 1);
    ctx.globalCompositeOperation = "multiply";

    entity.components.graphics.draw(ctx);

    var piece = (function(){
      var imgData=ctx.getImageData(cut.x,cut.y,cut.w,cut.h);
      return imgData;
    })();

    well = colorizeImageData(well,[255,0,0,255]);
    piece = colorizeImageData(piece,[0,255,0,255]);

    offscreenContext.clearRect(0,0,offscreen.width,offscreen.height);
    offscreenContext.globalCompositeOperation = "multiply";

    offscreenContext.drawImage(dataURLtoImg(imgDataToDataURL(well)),0,0);
    offscreenContext.drawImage(dataURLtoImg(imgDataToDataURL(piece)),0,2); // allow for a 2px "offset" we scootch the shape 2px down further than we shoot so it detects in time and to account for anti-aliasing weirdness

    var isCollision = (function(){
      var imgData = offscreenContext.getImageData(0,0,offscreen.width,offscreen.height);
      var data = imgData.data;
      for(var i = 0; i <= data.length - 4; i+=4) {
        var isRed = (data[i] == 255 && !data[i+1] && !data[i+2]),
        isGreen = (!data[i] && data[i+1] == 255 && !data[i+2]),
        isNothing = (data[i] == 0 && data[i+1] == 0 && data[i+2] == 0 && data[i+3] == 0);

         if(!isRed && !isGreen && !isNothing) {
           console.log(data[i],data[i+1],data[i+2],data[i+3]);
           return true;
         }
      }
      return false;
    })();

    drawWell();

    function drawWell() {
      // draw the well
      ctx.fillStyle = 'blue';
      ctx.fillRect(-1,0,2,(0.02)*10); 
    }

  }

  ctx.restore();

  //
  if(!isCollision) window.requestAnimationFrame(this.tick.bind(this));
}

exports.GraphicsSystem = GraphicsSystem;

function colorizeImageData(imgData,color) {
  var data = imgData.data;
  for(var i = 0; i <= data.length-4; i+=4) {
    if(!(!data[i] && !data[i+1] && !data[i+2] && !data[i+3])) {

      data[i] = color[0];
      data[i+1] = color[1];
      data[i+2] = color[2];
      data[i+3] = color[3];
    }
  }
  return imgData;
}

function imgDataToDataURL(imgData) {
  var c = document.createElement('canvas');

  c.width = imgData.width;
  c.height = imgData.height;

  c.getContext('2d').putImageData(imgData,0,0);
  return c.toDataURL();
}

function dataURLtoImg(dataURL) {
    var img = new Image();

    img.src = dataURL;
    return img;
}

},{}],13:[function(require,module,exports){
var InputSystem = function(tetris,canvas) {
  this.tetris = tetris;
  this.entities = tetris.entities;
  this.canvas = canvas;
};

InputSystem.prototype.run = function() {
  this.canvas.addEventListener('click',this.onClick.bind(this));
  document.body.addEventListener('keydown',this.onkeydown.bind(this));
  document.body.addEventListener('keyup',this.onkeyup.bind(this));
};

InputSystem.prototype.onClick = function() {
  this.tetris.shapes.currentShape.rotate(1);
}

InputSystem.prototype.onkeydown = function(e) {
  switch(e.keyCode) {
    case 38: // top
    this.onClick();
    break;

    case 39: // right
    this.tetris.shapes.currentShape.translate(1,0);
    break;

    case 40: // bottom
    this.tetris.shapes.currentShape.components.physics.acceleration.y = 2;
    break;

    case 37: // left
    this.tetris.shapes.currentShape.translate(-1,0);
    break;
  }
};

InputSystem.prototype.onkeyup = function(e) {
  this.tetris.shapes.currentShape.components.physics.acceleration.y = 1;
}

exports.InputSystem = InputSystem;

},{}],14:[function(require,module,exports){
var PhysicsSystem = function(entities) {
    this.entities = entities;
    this.interval = null;
};

PhysicsSystem.prototype.run = function() {
    // Run the update loop
    this.interval = window.setInterval(this.tick.bind(this), 1000 /12);
};

PhysicsSystem.prototype.tick = function() {
    for (var i=0; i<this.entities.length; i++) {
        var entity = this.entities[i];
        if (!'physics' in entity.components) continue;

        entity.components.physics.update();
    }
};

exports.PhysicsSystem = PhysicsSystem;

},{}],15:[function(require,module,exports){
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

},{"../entities/jshape":3,"../entities/line":4,"../entities/lshape":5,"../entities/shape":6,"../entities/square":7,"../entities/sshape":8,"../entities/tee":9,"../entities/zshape":10}],16:[function(require,module,exports){
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

},{"./entities/jshape":3,"./entities/line":4,"./entities/lshape":5,"./entities/shape":6,"./entities/square":7,"./entities/sshape":8,"./entities/tee":9,"./entities/zshape":10,"./systems/graphics":12,"./systems/input":13,"./systems/physics":14,"./systems/shape_system":15}]},{},[11]);
