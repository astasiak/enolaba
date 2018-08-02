$(function() {
  var stage = new Konva.Stage({
    container: 'container',
    width: 300,
    height: 300
  });
  var layer = new Konva.Layer();
  var rect = new Konva.Rect({
    x: 50,
    y: 50,
    width: 100,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4
  });
  layer.add(rect);
  stage.add(layer);
});
