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
