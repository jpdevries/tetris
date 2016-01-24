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
