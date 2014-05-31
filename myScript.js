$("#canvas").attr('width', '1280px');
$("#canvas").attr('height', '720px');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = $("#canvas").width();
var height = $("#canvas").height();

function Mover(x, y) {
  this.location = new PVector(x, y);
  this.velocity = new PVector(0, 0);
  this.acceleration = new PVector(0, 0);
  this.r = 10;
  this.maxforce = 10; // Maximum steering force
  this.maxspeed = 3; // Maximum speed
}

Mover.prototype = {
  applyForce: function (force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  },

  render: function () {
    // Draw a triangle rotated in the direction of velocity

    var theta = this.velocity.heading() + (Math.PI / 2);
    //console.log(this.velocity.heading());
    //fill(175);
    //stroke(0);
    //pushMatrix();
    //ctx.restore();
    //ctx.save();
    ctx.fillStyle = '#aaa';
    ctx.fillStyle = '#222';
    //ctx.translate(this.location.x, this.location.y);
    //ctx.rotate(theta);
    //beginShape(TRIANGLES);
    ctx.beginPath();
    ctx.moveTo(this.location.x, this.location.y - this.r * 2);
    ctx.lineTo(this.location.x - this.r, this.location.y + this.r * 2);
    ctx.lineTo(this.location.x + this.r, this.location.y + this.r * 2);
    // ctx.moveTo(0, -this.r * 2);
    // ctx.lineTo(-this.r, this.r * 2);
    // ctx.lineTo(this.r, this.r * 2);
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
    //endShape();
    //popMatrix();
    //ctx.restore();
    //ctx.save();
  },

  // Wraparound
  borders: function () {
    if (this.location.x < -this.r) this.location.x = width + this.r;
    if (this.location.y < -this.r) this.location.y = height + this.r;
    if (this.location.x > width + this.r) this.location.x = -this.r;
    if (this.location.y > height + this.r) this.location.y = -this.r;
  }
};

var Me = function (x, y) {

  this.run = function () {
    this.update();
    this.borders();
    this.render();
    //this.move();
  };

  // Method to update location
  this.update = function () {
    // Update velocity
    //friction
    var frictionElement = 0.1;
    var friction = new PVector(this.velocity.x, this.velocity.y);
    friction.mult(-1);
    friction.normalize();
    friction.mult(frictionElement);
    this.acceleration.add(friction);

    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);

    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);

  };

  // this.move = function () {
  //   $(window).keydown(function (e) {
  //     if (e.which === 38) {
  //       var up = new PVector(0, -1);
  //       this.applyForce(up);
  //     } else if (e.which === 40) {
  //       var down = new PVector(0, 1);
  //       this.applyForce(down);
  //     } else if (e.which === 37) {
  //       var left = new PVector(-1, 0);
  //       this.applyForce(left);
  //     } else if (e.which === 39) {
  //       var right = new PVector(1, 0);
  //       this.applyForce(right);
  //     }
  //   });
  // };

};

Me.prototype = new Mover();

var Boid = function (x, y) {
  this.velocity = new PVector(Math.random() * 2 - 1, Math.random() * 2 - 1);

  this.run = function (boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  };
  this.flock = function (boids) {
    var sep = this.separate(boids); // Separation
    var ali = this.align(boids); // Alignment
    var coh = this.cohesion(boids); // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1);
    ali.mult(1);
    coh.mult(1);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  };

  this.update = function () {
    // Update velocity
    //friction
    // var frictionElement = 0.1;
    // var friction = new PVector(this.velocity.x, this.velocity.y);
    // friction.mult(-1);
    // friction.normalize();
    // friction.mult(frictionElement);
    // this.acceleration.add(friction);

    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);

    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);

  };

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function (target) {
    var desired = PVector.sub(target, this.location); // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    var steer = PVector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force
    return steer;
  };

  // Separation
  // Method checks for nearby boids and steers away
  this.separate = function (boids) {
    var desiredseparation = 25;
    var steer = new PVector(0, 0);
    var count = 0;
    // For every boid in the system, check if it's too close
    boids.forEach(function (other) {
      var d = PVector.dist(this.location, other.location);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < desiredseparation)) {
        // Calculate vector pointing away from neighbor
        var diff = PVector.sub(this.location, other.location);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++; // Keep track of how many
      }
    });
    // Average -- divide by how many
    if (count > 0) {
      steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    console.log(steer);
    return steer;
  };

  // Alignment
  // For every nearby boid in the system, calculate the average velocity
  this.align = function (boids) {
    var neighbordist = 50;
    var sum = new PVector(0, 0);
    var count = 0;
    boids.forEach(function (other) {
      var d = PVector.dist(this.location, other.location);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.velocity);
        count++;
      }
    });
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      var steer = PVector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return new PVector(0, 0);
    }
  };

  // Cohesion
  // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
  this.cohesion = function (boids) {
    var neighbordist = 50;
    var sum = new PVector(0, 0); // Start with empty vector to accumulate all locations
    var count = 0;
    boids.forEach(function (other) {
      var d = PVector.dist(this.location, other.location);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(other.location); // Add location
        count++;
      }
    });
    if (count > 0) {
      sum.div(count);
      return seek(sum); // Steer towards the location
    } else {
      return new PVector(0, 0);
    }
  };
};
Boid.prototype = new Mover();

function drawBg() {
  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, width, height);
}

//-----------------------------main------------------------------
var me;
var boids = [];

function init() {
  //for(var i=0,)
  me = new Me(width / 2, height / 2);
  for (var i = 0; i < 3; i++) {
    boids.push(new Boid(width / 2, height / 2));
  }
}

function draw(foo, rate) {
  setTimeout(function () {
    requestAnimationFrame(function () {
      draw(foo, rate);
    });
    foo();
  }, 1000 / rate);
}

$(window).keydown(function (e) {
  e.preventDefault();
  //console.log(me.acceleration);
  if (e.which === 38) {
    var up = new PVector(0, -3);
    me.applyForce(up);
    //me.location.y--;
  } else if (e.which === 40) {
    var down = new PVector(0, 3);
    me.applyForce(down);
  } else if (e.which === 37) {
    var left = new PVector(-3, 0);
    me.applyForce(left);
  } else if (e.which === 39) {
    var right = new PVector(3, 0);
    me.applyForce(right);
  }
});

init();
draw(function () {
  drawBg();
  me.run();
  //console.log(me.acceleration);
  boids.forEach(function (b) {
    b.run(boids);
  });
  //console.log(me.velocity);
}, 30);