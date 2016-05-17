var collisionSystem = require('./collision_system');
var EventEmitter = require('events');
var util = require('util');

var GraphicsSystem = function(entities,canvas) {
  var that = this;

  this.blocksPerRow = 25;
  this.blockStep = 1 / this.blocksPerRow;

  this.running = false;

  this.entities = entities;
  this.well = (function(blocksPerRow){
    var well = [];

    for(var i = 0; i < blocksPerRow; i++) well.push(makeRow(false)); //i ? false : true

    function makeRow(fill) {
      var r = [];
      for(var i = 0; i < blocksPerRow; i++) r.push(fill ? 'green' : 0);
      return r;
    }

    return well;
  })(this.blocksPerRow);
  console.log(this.well);
  this.collision = new collisionSystem.CollisionSystem(this.well);

  this.WOULD_COLLIDE = this.collision.WOULD_COLLIDE;
  //this.collisionSystem.run();

  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');

  this.interval = null;



  window.onresize = function() {
    that.handleResize();
  };
  that.handleResize();
}

util.inherits(GraphicsSystem, EventEmitter);

GraphicsSystem.prototype.handleResize = function() {
  this.canvas.width = 650; //window.innerWidth;
  this.canvas.height = 650; //window.innerHeight;
}

GraphicsSystem.prototype.addToWell = function(shape) {
  console.log('addToWell',shape,shape.getPosition(),shape.getBlockCoords());

  var position = shape.getPosition();
  var rows = shape.getBlockCoords();
  var well = this.well;

  var r = 0;
  for(var i = position.y; i < position.y + 4; i++) {
    console.log(i);
    if(i >= 0) {
      //console.log(i,well[i],rows[r]);
      well[i] = (function(wellRow,blocks){
        for(var i = position.x; i < position.x + blocks.length; i++) {
          if(blocks[i-position.x]) wellRow[i] = 'red';
          //console.log(i,wellRow[i],blocks[i-position.x]);
        }
        return wellRow;
      })(well[i],rows[r]);
    }
    r++;
  }



}

GraphicsSystem.prototype.run = function() {
    this.interval = window.setInterval(this.tick.bind(this), 1000 / 12);
    //Run the graphics rendering loop. requestAnimationFrame runs ever 1/60th of a second.
    this.running = true;
    //window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.step = function() {
  this.tick();
}

GraphicsSystem.prototype.stop = function() {
  console.log('stop');
  this.running = false;
  clearInterval(this.interval);
};

GraphicsSystem.prototype.paintWell = function() {
  console.log('paintWell',this.well);
  var canvas = this.canvas;
  var ctx = this.context,
  collision = this.collision;

  var well = this.well;
  var blockSize = 1;

  ctx.save();

  for(var i = 0; i < well.length; i++) {

    (function(wellRow){
      //console.log(wellRow);
      ctx.save();
      for(var i = 0; i < wellRow.length; i++) {
        //console.log(wellRow[i]);
        if(wellRow[i]) {
          ctx.fillStyle = wellRow[i];
          ctx.fillRect(0, 0, blockSize, blockSize); // paint tile
        }
        ctx.translate(blockSize,0);
      }
      ctx.restore();
    })(well[i]);

    ctx.translate(0,1);
  }

  ctx.restore();
};

GraphicsSystem.prototype.tick = function() {


  var canvas = this.canvas;
  var ctx = this.context,
  collision = this.collision;

  //let snapPoint = (point,freq) => (Math.floor(point / freq) * freq) + ((point % freq >= (freq / 2)) ? freq : 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  this.paintWell();

  ctx.save();

  ctx.translate(0,canvas.height);
  ctx.scale(canvas.height / this.blocksPerRow,-canvas.height / this.blocksPerRow);

  ctx.globalCompositeOperation = 'difference';

  //ctx.fillStyle = 'green';
  //ctx.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
  //ctx.fillRect(0,0,this.blocksPerRow,1);

  for(var i = 0; i < this.entities.length; i++) {
    var entity = this.entities[i];
    if (!'graphics' in entity.components) continue;
    var blocks = entity.components.graphics.draw(ctx);
    var position = entity.getPosition();

    //console.log(position);

    //console.log('blocks',blocks);
    //console.log(blocks);
    var wouldCollide = collision.wouldCollide(position,blocks);
    if(wouldCollide || position.y < -5) {
      //console.log('COLLIDE!');
      this.emit(collision.WOULD_COLLIDE);
    }

  }

  ctx.restore();

  //if(this.running) window.requestAnimationFrame(this.tick.bind(this));
}



exports.GraphicsSystem = GraphicsSystem;
