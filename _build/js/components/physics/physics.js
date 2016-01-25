var PhysicsComponent = function(entity) {
    this.entity = entity;

    this.position = {
        x: 0,
        y: 0
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.acceleration = {
        x: 0,
        y: 1
    };
};

PhysicsComponent.prototype.update = function() {

    //this.position.x += this.velocity.x * delta;
    this.position.y = Math.max(0,this.position.y - (.02*this.acceleration.y));
};

exports.PhysicsComponent = PhysicsComponent;
