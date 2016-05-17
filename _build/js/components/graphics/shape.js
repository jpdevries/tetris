var ShapeGraphicsComponent = function(entity,color,rotation,blockSize) {
  this.entity = entity;
  this.color = typeof(color)  == 'undefined' ? randomColor() : color;
  this.rotation = typeof(rotation) == 'undefined' ? 0 : rotation;
  this.blockSize = typeof(blockSize) == 'undefined' ? 1 : blockSize;
  this.rows = [];
}

ShapeGraphicsComponent.prototype.getPosition = function() {
  return this.entity.components.physics.position;
};

ShapeGraphicsComponent.prototype.draw = function (context) {
  var canvas = document.getElementById("canvas");
  var position = this.entity.components.physics.position;

  var tiles = this.entity.getCurrentMatrix(),
  blockSize = this.blockSize,
  color = this.color;

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
};

function randomColor() {
  var colors = ['#fee109',
  '#ff6113',
  '#0036fb',
  '#fe0005',
  '#31cbff',
  '#38cd00'];

  return colors[Math.round(Math.random() * (colors.length-1))];
  //return '#'+Math.floor(Math.random()*16777215).toString(16);
}

exports.ShapeGraphicsComponent = ShapeGraphicsComponent;
