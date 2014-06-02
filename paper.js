/* global utils,PVector,Path,Flock,Boid */
(function (exports) {
  var paper = utils.setup();
  var width = paper.width;
  var height = paper.height;

  exports.separateDis = 50;
  exports.alignDis = 100;
  exports.cohesionDis = 100;
  exports.sepWeight = 1.5;
  exports.aliWeight = 1;
  exports.cohWeight = 1;
  exports.stop = false;

  var flock = new Flock();

  for (var i = 0; i < 5; i++) {
    flock.add(new Boid(width / 2, height / 2, 3, 0.2, paper));
  }

  utils.draw(24, function () {
    if (!exports.stop) {
      flock.run();
      exports.sepWeight = stats[0].value;
      exports.aliWeight = stats[1].value;
      exports.cohWeight = stats[2].value;
    }
  });

  var click = false;
  paper.canvas.onmousedown = function () {
    click = true;
  };

  paper.canvas.onmouseup = function () {
    click = false;
  };

  paper.canvas.onmousemove = function (e) {
    //click && flock.add(new Boid(e.layerX, e.layerY, 3, 0.2, paper));
  };

  exports.flock = flock;
})(this);