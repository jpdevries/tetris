var PhysicsSystem = function(entities) {
    this.entities = entities;
    this.interval = null;
};

PhysicsSystem.prototype.run = function() {
    // Run the update loop
    this.interval = window.setInterval(this.tick.bind(this), 1000 /12);
};

PhysicsSystem.prototype.tick = function() {
    for (var i=0; i<this.entities.length; i++) {
        var entity = this.entities[i];
        if (!'physics' in entity.components) continue;

        entity.components.physics.update();
    }
};

exports.PhysicsSystem = PhysicsSystem;
