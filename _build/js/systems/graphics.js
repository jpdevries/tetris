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

  ctx.globalCompositeOperation = "multiply";

  ctx.clearRect(0, 0, canvas.width, canvas.height); // right here

  //ctx.fillStyle = 'orange';
  //ctx.fillRect(canvas.width/2,0,0.02*4 * canvas.height,canvas.height);

  ctx.save();

  ctx.translate(canvas.width/2,canvas.height);
  ctx.scale(canvas.height,-canvas.height);

  var offscreen = document.getElementById('offscreen'),
  offscreenContext = offscreen.getContext('2d');


  var collisionOccured = false;
  for(var i = 0; i < this.entities.length; i++) {

    var entity = this.entities[i];
    if (!'graphics' in entity.components) continue;
    var position = entity.components.physics.position;

    drawWell();

    var cut = { // getImageData ignores the transformation coordinates so we have to convert our custom units back to px
      x: Math.ceil(canvas.width/2-((.02*2) * canvas.height-(position.x*canvas.height))),
      y: Math.ceil(canvas.height-(((.02 * (4-0))+position.y)*canvas.height)),
      w: Math.ceil(0.02*4 * canvas.height),
      h: Math.ceil((.02*4)*canvas.height)
    };

    var well = (function(){ // slice out the portion of our well that falls within the bounding box of the shape, if any
      var imgData = ctx.getImageData(cut.x,cut.y,cut.w,cut.h);
      return imgData;
    })();

    ctx.clearRect(-1, 0, 2, 1);
    ctx.globalCompositeOperation = "multiply";

    entity.components.graphics.draw(ctx);

    var piece = (function(){
      var imgData=ctx.getImageData(cut.x,cut.y,cut.w,cut.h);
      return imgData;
    })();

    well = colorizeImageData(well,[255,0,0,255]);
    piece = colorizeImageData(piece,[0,255,0,255]);

    offscreenContext.clearRect(0,0,offscreen.width,offscreen.height);
    offscreenContext.globalCompositeOperation = "multiply";

    offscreenContext.drawImage(dataURLtoImg(imgDataToDataURL(well)),0,0);
    offscreenContext.drawImage(dataURLtoImg(imgDataToDataURL(piece)),0,2); // allow for a 2px "offset" we scootch the shape 2px down further than we shoot so it detects in time and to account for anti-aliasing weirdness

    var isCollision = (function(){
      var imgData = offscreenContext.getImageData(0,0,offscreen.width,offscreen.height);
      var data = imgData.data;
      for(var i = 0; i <= data.length - 4; i+=4) {
        var isRed = (data[i] == 255 && !data[i+1] && !data[i+2]),
        isGreen = (!data[i] && data[i+1] == 255 && !data[i+2]),
        isNothing = (data[i] == 0 && data[i+1] == 0 && data[i+2] == 0 && data[i+3] == 0);

         if(!isRed && !isGreen && !isNothing) {
           //console.log(data[i],data[i+1],data[i+2],data[i+3]);
           collisionOccured = true;
           return true;
         }
      }
      return false;
    })();

    drawWell();

    if(isCollision)  {
      entity.collided = true;
      //entity = null;
      //this.entities[i] = null;
      //break;

    } else {

    }



    function drawWell() {
      // draw the well
      ctx.fillStyle = 'blue';
      ctx.fillRect(-1,0,2,(0.02)*10);
    }

  }

  window.requestAnimationFrame(this.tick.bind(this));

  if(collisionOccured) {
    //this.entities = this.entities.filter(function(val) { return val !== null; }).join(", ");
  }


  ctx.restore();




}

exports.GraphicsSystem = GraphicsSystem;

function colorizeImageData(imgData,color) {
  var data = imgData.data;
  for(var i = 0; i <= data.length-4; i+=4) {
    if(!(!data[i] && !data[i+1] && !data[i+2] && !data[i+3])) {

      data[i] = color[0];
      data[i+1] = color[1];
      data[i+2] = color[2];
      data[i+3] = color[3];
    }
  }
  return imgData;
}

function imgDataToDataURL(imgData) {
  var c = document.createElement('canvas');

  c.width = imgData.width;
  c.height = imgData.height;

  c.getContext('2d').putImageData(imgData,0,0);
  return c.toDataURL();
}

function dataURLtoImg(dataURL) {
    var img = new Image();

    img.src = dataURL;
    return img;
}
