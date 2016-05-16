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
  this.collision = new collisionSystem.CollisionSystem(entities,this.well);

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

GraphicsSystem.prototype.run = function() {
    this.interval = window.setInterval(this.tick.bind(this), 1000 / 12);
    //Run the graphics rendering loop. requestAnimationFrame runs ever 1/60th of a second.
    this.running = true;
    //window.requestAnimationFrame(this.tick.bind(this));
};

GraphicsSystem.prototype.stop = function() {
  this.running = false;
  clearInterval(this.interval);
};

GraphicsSystem.prototype.tick = function() {
  var canvas = this.canvas;
  var ctx = this.context,
  collision = this.collision;

  //let snapPoint = (point,freq) => (Math.floor(point / freq) * freq) + ((point % freq >= (freq / 2)) ? freq : 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
