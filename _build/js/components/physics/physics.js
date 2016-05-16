var PhysicsComponent = function(entity) {
    this.entity = entity;

    this.position = {
        x: Math.floor(25/2),
        y: 25-1
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

    this.position.y = Math.max(this.position.y-1,-4);
    //this.position.x = 0;
    //this.position.y = 1;
    //this.position.y = this.position.y;
};

exports.PhysicsComponent = PhysicsComponent;
