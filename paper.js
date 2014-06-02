/* global utils,PVector,Path,Flock,Boid,ColorBlock */
(function (exports) {
  var paper = utils.setup(400, 400, '#000', '#paper', 'paper');
  var width = paper.width;
  var height = paper.height;

  exports.separateDis = 50;
  exports.alignDis = 100;
  exports.cohesionDis = 100;
  exports.sepWeight = 2;
  exports.aliWeight = 0.6;
  exports.cohWeight = 0.4;
  exports.stop = false;

  exports.flock = null;

  utils.draw(20, function () {
    if (!exports.stop && exports.flock) {
      exports.flock.run();
      exports.sepWeight = stats[0].value;
      exports.aliWeight = stats[1].value;
      exports.cohWeight = stats[2].value;
    }
  });

  var click = false;
  paper.canvas.onmousedown = function (e) {
    click = true;
    if (flock !== null) {
      flock.boids.forEach(function (item) {
        var triangle = item.line;
        triangle.remove();
      });
    }
    exports.flock = new Flock();
    for (var i = 0; i < 5; i++) {
      exports.flock.add(new Boid(e.layerX, e.layerY, 3, 0.2, paper));
    }
  };

  paper.canvas.onmouseup = function (e) {
    click = false;
  };

  var preview = utils.setup(550, 100, "#000", "#result", "result");
  var colorBlocks = [];
  for (var j = 0; j < 5; j++) {
    colorBlocks.push(new ColorBlock(j * 110, 0, preview, j));
  }
  utils.draw(4, function () {
    for (var k = 0; k < 5; k++) {
      colorBlocks[k].refreshColor();
      var arr = ['#', 'value', k];
      var name = arr.join('');
      $(name).html(
        '<div class="hex">' + 'HEX ' + colorBlocks[k].color + '<div/>' +
        '<div class="rgb">' + 'RGB ' +
        colorBlocks[k].rColor + ' ' +
        colorBlocks[k].gColor + ' ' +
        colorBlocks[k].bColor + '<div/>' +
        '<div class="hsb">' + 'HSB ' +
        colorBlocks[k].hue + ' ' +
        colorBlocks[k].saturation + ' ' +
        colorBlocks[k].brightness + '<div/>'
      );
    }
  });

})(this);