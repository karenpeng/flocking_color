(function (exports) {
  var ColorBlock = function (x, y, paper, i) {
    this.x = x;
    this.y = y;
    this.color = "#000";
    this.rColor = 0;
    this.gColor = 0;
    this.bColor = 0;
    this.hue = 0;
    this.saturation = 0;
    this.brightness = 0;
    this.paper = paper;
    this.i = i;
    this._initBody();
  };

  ColorBlock.prototype.refreshColor = function (i) {
    if (flock !== null) {
      if (flock.boids[this.i].rColor === undefined) {
        this.color = "#000";
        this.rColor = 0;
        this.gColor = 0;
        this.bColor = 0;
        this.hue = 0;
        this.saturation = 0;
        this.brightness = 0;
      } else {
        this.color = flock.boids[this.i].color;
        this.rColor = flock.boids[this.i].rColor;
        this.gColor = flock.boids[this.i].gColor;
        this.bColor = flock.boids[this.i].bColor;
        this.hue = flock.boids[this.i].hue;
        this.saturation = flock.boids[this.i].saturation;
        this.brightness = 1;
      }
    }
    this.rec.attr({
      fill: this.color
    });
  };

  ColorBlock.prototype._initBody = function () {
    this.rec = this.paper.rect(this.x, this.y, 100, 100);
    return this;
  };

  exports.ColorBlock = ColorBlock;

})(this);