var tetris = require('./tetris');

document.addEventListener('DOMContentLoaded', function() {
    var app = new tetris.Tetris();
    app.run();
});
