var InputSystem = function(tetris,canvas) {
  this.tetris = tetris;
  this.entities = tetris.entities;
  this.canvas = canvas;
};

InputSystem.prototype.run = function() {
  this.canvas.addEventListener('click',this.onClick.bind(this));
  document.body.addEventListener('keydown',this.onkeydown.bind(this));
  document.body.addEventListener('keyup',this.onkeyup.bind(this));
};

InputSystem.prototype.onClick = function() {
  this.tetris.shapes.currentShape.rotate(1);
}

InputSystem.prototype.onkeydown = function(e) {
  switch(e.keyCode) {
    case 38: // top
    this.onClick();
    break;

    case 39: // right
    this.tetris.shapes.currentShape.translate(1,0);
    break;

    case 40: // bottom
    this.tetris.shapes.currentShape.components.physics.acceleration.y = 2;
    break;

    case 37: // left
    this.tetris.shapes.currentShape.translate(-1,0);
    break;
  }
};

InputSystem.prototype.onkeyup = function(e) {
  this.tetris.shapes.currentShape.components.physics.acceleration.y = 1;
}

exports.InputSystem = InputSystem;
