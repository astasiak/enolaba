function initStage() {
  var WIDTH = 1500;
  var HEIGHT = 1000;
  var stage = new Konva.Stage({
    container: 'container',
    width: HEIGHT,
    height: WIDTH
  });
  function fitStageIntoParentContainer() {
    var container = document.querySelector('#stage-parent');
    [height, width] = [HEIGHT, WIDTH];
    if ((HEIGHT/WIDTH-1)*(container.offsetHeight/container.offsetWidth-1)<0) {
      [height, width] = [WIDTH, HEIGHT];
      stage.offsetY(HEIGHT);
      stage.rotation(90);
    } else {
      stage.offsetY(0);
      stage.rotation(0);
    }
    var scaleWidth = container.offsetWidth / width;
    var scaleHeight = container.offsetHeight / height;
    var scale = Math.min(scaleWidth, scaleHeight);
    var missingHeight = container.offsetHeight - height * scale;
    $("#container").width(width * scale);
    $("#container").css('margin-top', (missingHeight/2)+'px');
    stage.width(width * scale);
    stage.height(height * scale);
    stage.scale({ x: scale, y: scale });
    stage.draw();
  }
  fitStageIntoParentContainer();
  window.addEventListener('resize', fitStageIntoParentContainer);
  return stage;
}

class Board {
  constructor(stage, size) {
    this.stage = stage;
    this.size = size;
    this.fields = this.initFields(size);
    this.backgroundLayer = new Konva.Layer();
    this.stonesLayer = new Konva.Layer();
    this.stones = {};
    this.stage.add(this.backgroundLayer);
    this.stage.add(this.stonesLayer);
  }

  initFields(size) {
    var n = 2*size - 1;
    return Array(n).fill(0).map(x => Array(n).fill(0));
  }

  show() {
    var n = 2*this.size-1;
    var fieldSize = 1000 / n;
    for (var si=0; si<n; si++) {
      for (var sj=0; sj<n; sj++) {
        var i = si - this.size + 1;
        var j = sj - this.size + 1;
        if (Math.abs(i-j)<this.size) {
          let [x, y] = this.positionOfField(i, j);
          var circle = new Konva.Circle({
            x: x,
            y: y,
            radius: fieldSize * 0.5,
            fill: 'white',
            stroke: 'red',
            strokeWidth: 2
          });
          var fieldContent = this.fields[si][sj];
          var backgroundLayer = this.backgroundLayer;
          circle.on('mousedown touchstart', function() {
            var color = this.fill() == 'white' ? 'yellow' : 'white';
            this.fill(color);
            backgroundLayer.draw();
          });
          this.backgroundLayer.add(circle);
          if (['A', 'B'].includes(fieldContent)) {
            var stoneColor = fieldContent == 'A' ? 'red' : 'blue';
            var stoneCircle = new Konva.Circle({
              x: x,
              y: y,
              radius: fieldSize * 0.4,
              fill: stoneColor
            });
            this.putStoneAt(i, j, stoneCircle);
            this.stonesLayer.add(stoneCircle);
          }
        }
      }
    }
    this.showRotatingStar();
    this.backgroundLayer.draw();
    this.stonesLayer.draw();
  }

  showRotatingStar() {
    var star = new Konva.Star({
      x: 100,
      y: 100,
      numPoints: 7,
      innerRadius: 40,
      outerRadius: 70,
      fill: 'yellow',
      stroke: 'black',
      strokeWidth: 4
    });
    this.stonesLayer.add(star);
    var angularSpeed = 90;
    var anim = new Konva.Animation(function(frame) {
        var angleDiff = frame.timeDiff * angularSpeed / 1000;
        star.rotate(angleDiff);
    }, this.stonesLayer);
    anim.start();
  }

  positionOfField(i, j) {
    var fieldSize = 1000 / (2*this.size-1);
    return [750 + i*fieldSize - 0.5*j*fieldSize, 500 + j*fieldSize*0.866];
  }

  putStoneAt(i, j, stone) {
    this.stones[this.keyFor(i, j)] = stone;
  }

  removeStoneAt(i, j) {
    this.stones[this.keyFor(i, j)] = null;
  }

  getStoneFrom(i, j) {
    return this.stones[this.keyFor(i, j)];
  }

  keyFor(i, j) {
    return 'key'+i+':'+j;
  }

  animate(i1, j1, i2, j2, time) {
    var stone = this.getStoneFrom(i1, j1);
    var [x1, y1] = this.positionOfField(i1, j1);
    var [x2, y2] = this.positionOfField(i2, j2);
    var anim = new Konva.Animation(function(frame) {
      var ratio = frame.time / time;
      var posratio = 0.5 - Math.cos(ratio * Math.PI)/2;
      var x = x1 * (1-posratio) + x2 * posratio;
      var y = y1 * (1-posratio) + y2 * posratio;
      stone.position({x: x, y: y});
    }, this.stonesLayer);

    anim.start();
    setTimeout(() => {
      anim.stop();
      stone.position({x: x2, y: y2});
      this.stonesLayer.draw();
      this.removeStoneAt(i1, j2);
      this.putStoneAt(i2, j2, stone);
    }, time);
  }
}

$(function() {
  var stage = initStage();
  var board = new Board(stage, 3);
  //board.showSample('Enolaba');
  board.fields[1][1] = 'A';
  board.fields[2][1] = 'B';
  board.fields[2][2] = 'B';
  board.show();
  setTimeout(() => {
    board.animate(0,0,1,1,500);
    board.animate(-1,-1,0,0,500);
  }, 1000);
  setTimeout(() => {
    board.animate(0,0,-1,0,500);
  }, 2000);
  setTimeout(() => {
    board.animate(1,1,0,1,500);
    board.animate(0,-1,-1,-1,500);
  }, 3000);
});
