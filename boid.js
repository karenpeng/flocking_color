/* global PVector,utils */
(function (exports) {
  var Boid = function (x, y, ms, mf, paper) {
    this.acceleration = new PVector();
    this.velocity = new PVector(utils.random(-1, 1), utils.random(-1, 1));
    this.location = new PVector(x, y);
    this.r = 6;
    this.maxspeed = ms;
    this.maxforce = mf;

    this.paper = paper;
    this.width = this.paper.width;
    this.height = this.paper.height;
    this.color = "#000";

    this._initBody();
  };

  Boid.prototype._getPath = function () {
    return 'M0 ' + (-this.r * 2) + 'L' + (-this.r) + ' ' +
      (this.r * 2) + 'L' + this.r + ' ' + (this.r * 2) + 'Z';
  };

  Boid.prototype._transform = function () {
    this.line.transform('t' + this.location.x + ',' + this.location.y + 'r' +
      utils.degree(this.velocity.heading() + Math.PI / 2));
  };

  Boid.prototype._initBody = function () {
    this.line = this.paper.path(this._getPath());
    //this.line.attr({fill: '#888', stroke: '#222'});
    this._transform();
    return this;
  };

  Boid.prototype.updateColor = function () {
    var hue = Math.round(this.location.x / 4) / 100;
    var saturation = Math.round(this.location.y / 4) / 100;
    hue = utils.constrain(hue, 0, 1);
    saturation = utils.constrain(saturation, 0, 1);
    this.color = Raphael.hsb2rgb(hue, saturation, 1).hex;
    this.rColor = Math.round(Raphael.hsb2rgb(hue, saturation, 1).r);
    this.gColor = Math.round(Raphael.hsb2rgb(hue, saturation, 1).g);
    this.bColor = Math.round(Raphael.hsb2rgb(hue, saturation, 1).b);
    this.hue = hue;
    this.saturation = saturation;

    //console.log(color);
    this.line.attr({
      fill: this.color,
      stroke: '#222',
      //stroke - width: 2
    });
  };

  Boid.prototype.seek = function (target) {
    // first get the desired velocity
    var desired = PVector.sub(target, this.location);
    desired.setMag(this.maxspeed);

    //get the diff of v, and calculate the steer force
    var steer = PVector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  };

  Boid.prototype.separate = function (Boids) {
    var desiredseparation = separateDis;
    var self = this;
    var count = 0;
    var sum = new PVector();
    Boids.forEach(function (v) {
      var dist = PVector.dist(v.location, self.location);
      if (dist > 0 && dist < desiredseparation) {
        count++;
        var diff = PVector.sub(self.location, v.location);
        diff.normalize().div(dist);
        sum.add(diff);
      }
    });
    if (count > 0) {
      sum.normalize().mult(this.maxspeed);
      var steer = PVector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    return new PVector();
  };

  Boid.prototype.align = function (boids) {
    var neighbordist = alignDis;
    var sum = new PVector();
    var count = 0;
    var self = this;
    boids.forEach(function (boid) {
      var d = PVector.dist(self.location, boid.location);
      if (d > 0 && d < neighbordist) {
        sum.add(boid.velocity);
        count++;
      }
    });
    if (count > 0) {
      sum.div(count)
        .normalize()
        .mult(this.maxspeed);
      var steer = PVector.sub(sum, this.velocity)
        .limit(this.maxforce);
      return steer;
    }
    return new PVector();
  };

  Boid.prototype.cohesion = function (boids) {
    var neighbordist = cohesionDis;
    var sum = new PVector();
    var count = 0;
    var self = this;
    boids.forEach(function (boid) {
      var d = PVector.dist(self.location, boid.location);
      if (d > 0 && d < neighbordist) {
        sum.add(boid.location);
        count++;
      }
    });

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }
    return new PVector();
  };

  Boid.prototype.applyForce = function (f) {
    this.acceleration.add(f);
    return this;
  };

  Boid.prototype.borders = function () {
    var location = this.location;
    var r = 3;
    if (location.x < -r) {
      location.x = this.width + r;
    }
    if (location.y < -r) {
      location.y = this.height + r;
    }
    if (location.x > this.width + r) {
      location.x = -r;
    }
    if (location.y > this.height + r) {
      location.y = -r;
    }
    return this;
  };

  Boid.prototype.flock = function (boids) {
    var sep = this.separate(boids);
    var ali = this.align(boids);
    var coh = this.cohesion(boids);
    sep.mult(sepWeight);
    ali.mult(aliWeight);
    coh.mult(cohWeight);
    this.applyForce(sep)
      .applyForce(ali)
      .applyForce(coh);
    return this;
  };

  Boid.prototype.update = function () {
    this.velocity.add(this.acceleration)
      .limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    this.updateColor();
    return this;
  };

  Boid.prototype.display = function () {
    this._transform();
  };

  Boid.prototype.run = function (boids) {
    this.flock(boids).update().borders().display();
    return this;
  };
  exports.Boid = Boid;
})(this);