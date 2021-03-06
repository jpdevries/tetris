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

  blockSize = typeof(blockSize) == 'undefined' ? 1 : blockSize;

  this.blockCoords = {
    x:0,
    y:0
  };

  var that = this;

  this.matrices = matrices;
  this.matrixIndex = 0;
  this.collided = false;

  this.getCurrentMatrix = function() {
    return that.matrices[that.matrixIndex];
  }

  var physics = new physicsComponent.PhysicsComponent(this);
  //physics.position.y = 25;
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
  };
  this.getPosition = function() {
    return physics.position;
  };
  this.getBlockCoords = function() {
    return that.components.graphics.rows;
  };
  this.translate = function(x,y) {
    that.blockCoords.x += x;
    that.blockCoords.y += y;

    var position = physics.position;
    //if(!position.y) return; // once they hit the ground they die
    position.x += x;
    position.y += y;
  };
}

exports.Shape = Shape;
