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

  this.matrix = matrix;

  var graphics = new graphicsComponent.ShapeGraphicsComponent(this,this.matrix);
  this.components = {
    physics: physics,
    graphics: graphics
  };
}

exports.Shape = Shape;
