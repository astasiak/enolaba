$(function() {
  var WIDTH = 1500;
  var HEIGHT = 1000;
  var stage = new Konva.Stage({
    container: 'container',
    width: HEIGHT,
    height: WIDTH
  });
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
    text: 'Enolaba',
    fontSize: 400,
    fontFamily: 'Calibri',
    fill: 'yellow'
  });
  layer.add(text);
  stage.add(layer);
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
});
