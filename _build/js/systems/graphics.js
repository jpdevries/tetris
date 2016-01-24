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
