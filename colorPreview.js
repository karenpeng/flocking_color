(function (exports) {
  var ColorBlock = function (x, y, paper, i) {
    this.x = x;
    this.y = y;
    this.color = "#000";
    this.paper = paper;
    this.i = i;
    this.initBody();
  };

  ColorBlock.prototype.refreshColor = function (i) {
    this.color = flock.boids[this.i].color;
    this.rec.attr({
      fill: this.color
    });
  };

  ColorBlock.prototype.initBody = function () {
    this.rec = this.paper.rect(this.x, this.y, 100, 100);
    return this;
  };

  var init = function () {
    var container = $("#result");
    var paper = new Raphael('result', 550, 100);
    console.log(paper);
    return paper;
  };

  var draw = function (frame, times, callback) {
    if (typeof frame === 'function') {
      callback = frame;
      times = null;
      frame = 30;
    } else if (typeof times === 'function') {
      callback = times;
      times = null;
    }
    if (!times) {
      lastTimer = setInterval(callback, 1000 / frame);
      return lastTimer;
    }
    var counter = 0;
    var timer = setInterval(function () {
      if (++counter === times) {
        clearInterval(timer);
      }
      callback();
    }, 1000 / frame);
    lastTimer = timer;
    return timer;
  };

  //------------main--------------
  var paper = init();
  var colorBlocks = [];
  for (var i = 0; i < 5; i++) {
    colorBlocks.push(new ColorBlock(i * 110, 0, paper, i));
  }
  draw(4, function () {
    colorBlocks.forEach(function (item) {
      item.refreshColor();
    });
  });

})(this);