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
