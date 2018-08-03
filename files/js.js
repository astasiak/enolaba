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
  }

  show() {
    var fieldSize = 1000 / (2*this.size-1);
    var layer = new Konva.Layer();
    for (var i=1-this.size; i<this.size; i++) {
      for (var j=1-this.size; j<this.size; j++) {
        if (Math.abs(i-j)<this.size) {
          var circle = new Konva.Circle({
            x: 750 + i*fieldSize - 0.5*j*fieldSize,
            y: 500 + j*fieldSize*0.866,
            radius: fieldSize / 2,
            fill: 'white',
            stroke: 'red',
            strokeWidth: 2
          });
          circle.on('click', function() {
            var color = this.fill() == 'white' ? 'yellow' : 'white';
            this.fill(color);
            layer.draw();
          });
          layer.add(circle);
        }
      }
    }
    this.stage.add(layer);
  }

  showSample(text) {
    var layer = new Konva.Layer();
    var rect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 1500,
      height: 1000,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 4
    });
    layer.add(rect);
    var circle = new Konva.Circle({
      x: 750,
      y: 500,
      radius: 300,
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 20
    });
    layer.add(circle);
    var text = new Konva.Text({
      x: 100,
      y: 250,
      text: text,
      fontSize: 400,
      fontFamily: 'Calibri',
      fill: 'yellow'
    });
    layer.add(text);
    this.stage.add(layer);
  }
}

$(function() {
  var stage = initStage();
  var board = new Board(stage, 3);
  //board.showSample('Enolaba');
  board.show();
});
