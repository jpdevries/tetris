var ShapeGraphicsComponent = function(entity,color,rotation,blockSize) {
  this.entity = entity;
  this.color = typeof(color)  == 'undefined' ? 'black' : color;
  this.rotation = typeof(rotation) == 'undefined' ? 0 : rotation;
  this.blockSize = typeof(blockSize) == 'undefined' ? 1 : blockSize;
  this.rows = [];
}

ShapeGraphicsComponent.prototype.getPosition = function() {
  return this.entity.components.physics.position;
};

ShapeGraphicsComponent.prototype.draw = function (context) {
  var position = this.entity.components.physics.position;

  var tiles = this.entity.getCurrentMatrix(),
  blockSize = this.blockSize;

  //console.log(this.entity.matrixIndex);

  context.save();
  context.translate(position.x, position.y);

  var rows = [];

  for(var i = 0; i < tiles.length; i+=4) { // go through the 16 tiles 4 at a time
    var row = [];
    (function(tiles,row){
      context.save();
      for(var i = 0; i < tiles.length; i++) {
        context.fillStyle = (tiles[i]) ? 'red' : 'pink';
        row.push((tiles[i]) ? 1 : 0);
        context.fillRect(0, 0, blockSize, blockSize); // paint tile
        context.translate(blockSize,0); // move to the right (next column)
      }
      context.restore(); // back to the left
    })(tiles.slice(i,i+4),row); // slice out the next four blocks and loop through them one by one
    rows.push(row);
    context.translate(0,blockSize); // move down (next row)
  }

  context.restore();

  this.rows = rows;

  return rows;

  /*
  context.save();
  context.translate(position.x, position.y);

  for(var i = 0; i < tiles.length; i+=4) { // go through the 16 tiles 4 at a time
    (function(tiles){
      context.save();
      for(var i = 0; i < tiles.length; i++) {
        context.fillStyle = (tiles[i]) ? 'red' : 'transparent';
        context.fillRect(0, 0, blockSize, blockSize); // paint tile
        context.translate(blockSize,0); // move to the right (next column)
      }
      context.restore(); // back to the left
    })(tiles.slice(i,i+4)); // slice out the next four blocks and loop through them one by one
    context.translate(0,blockSize); // move down (next row)
  }

  context.restore();
  */
};


exports.ShapeGraphicsComponent = ShapeGraphicsComponent;
