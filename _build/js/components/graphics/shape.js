var ShapeGraphicsComponent = function(entity,color,rotation,blockSize) {
  this.entity = entity;
  this.color = typeof(color)  == 'undefined' ? 'black' : color;
  this.rotation = typeof(rotation) == 'undefined' ? 0 : rotation;
  this.blockSize = typeof(blockSize) == 'undefined' ? 0.02 : blockSize;
}

ShapeGraphicsComponent.prototype.draw = function (context) {
  var position = this.entity.components.physics.position;

  var tiles = this.entity.getCurrentMatrix(),
  blockSize = this.blockSize;

  //console.log(this.entity.matrixIndex);

  context.save();

  context.translate(position.x, position.y);

  //context.translate(position.x, position.y+(blockSize*2));
  //context.rotate(Math.degreesToRadians(this.rotation));
  //context.translate(-blockSize*2,-blockSize*2);

  for(var i = 0; i < tiles.length; i+=4) { // go through the 16 tiles 4 at a time
    (function(tiles){
      context.save();
      for(var i = 0; i < tiles.length; i++) {
        context.fillStyle = (tiles[i]) ? 'black' : 'red';
        context.fillRect(0, 0, blockSize, blockSize); // paint tile
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



exports.ShapeGraphicsComponent = ShapeGraphicsComponent;
