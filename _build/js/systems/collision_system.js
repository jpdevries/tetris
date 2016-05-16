var CollisionSystem = function(entities,well) {
  //console.log('CollisionSystem');
    this.entities = entities;
    this.well = well;
    this.interval = null;
    this.WOULD_COLLIDE = 'wouldcollide';
};

CollisionSystem.prototype.wouldCollide = function(position,blocks) {
  // blocks is a two dimensional array (array of arrays)
  // each index of blocks[0-3] contains an array representing a row of four blocks
  // based on the y position of the shape, select the correct row to check for collisions
  if(position.y < 0) { // if negative y position shift up accordingly
    blocks = blocks[Math.abs(position.y)];
  } else { // otherwise just check the first (bottom) row for collisions
    blocks = blocks[0];
  }

  var well = this.well;


  // the row of the well to check collisions for
  //var r = well[Math.max(position.y-1,0)];
  var r = (function(){
    if(position.y > 0) return well[Math.max(position.y-1,0)];
    else { // force a "collision" when they hit the bottom
      var a = [];
      for(var i = 0; i < 25; i++) a.push(1);
      return a;
    }
  })();

  for(var i = position.x; i <= position.x + 4; i++) {
    if(position.x == 12) {
      //console.log(r,i,blocks,i-position.x);
    }
    try { if(r[i] && blocks[i-position.x]) return true; } catch(e) {}
  }

  return false;
};

/*
CollisionSystem.prototype.run = function() {
    // Run the update loop
    this.interval = window.setInterval(this.tick.bind(this), 1000 /12);
};

CollisionSystem.prototype.tick = function() {
    //console.log(this.entities.length);
    for (var i=0; i<this.entities.length; i++) {
        var entity = this.entities[i];

    }
};
*/

exports.CollisionSystem = CollisionSystem;
