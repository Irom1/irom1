document.addEventListener("DOMContentLoaded", function() {

var blobCount = 10;
var blobSize = 150;
var blobSpeed = 2;
var margin = 100;
var blobColor = 'rgba(255,255,255,0.5)';
var blobBorder = 'rgba(255,255,255,0.5)';
var blobBorderWidth = '0px';
var blobBorderStyle = 'solid';
var blobBorderRadius = '50%';
var blobZIndex = -1;
var blobStyle = 'position:fixed;top:0px;left:0px;width:' + blobSize + 'px;height:' + blobSize + 'px;background-color:' + blobColor + ';border:' + blobBorderWidth + ' ' + blobBorderStyle + ' ' + blobBorder + ';border-radius:' + blobBorderRadius + ';z-index:' + blobZIndex + ';';
var blobArray = [];
for (var i = 0; i < blobCount; i++) {
  var blob = document.createElement('div');
  blob.setAttribute('style', blobStyle);
  blob.setAttribute('class', 'blob');
  blob.setAttribute('id', 'blob' + i);
  blob.setAttribute('x', Math.random() * window.innerWidth);
  blob.setAttribute('y', Math.random() * window.innerHeight);
  blob.setAttribute('dx', Math.random() * blobSpeed - blobSpeed / 2);
  blob.setAttribute('dy', Math.random() * blobSpeed - blobSpeed / 2);
  blobArray.push(blob);
  document.body.appendChild(blob);
}

function moveBlobs() {
  for (var i = 0; i < blobCount; i++) {
    var blob = blobArray[i];
    var x = parseFloat(blob.getAttribute('x'));
    var y = parseFloat(blob.getAttribute('y'));
    var dx = parseFloat(blob.getAttribute('dx'));
    var dy = parseFloat(blob.getAttribute('dy'));
    x += dx;
    y += dy;
    if (x < 0) {
      x = 0;
      dx = -dx;
    }
    if (x > window.innerWidth - blobSize) {
      x = window.innerWidth - blobSize;
      dx = -dx;
    }
    if (y < margin) {
      y = margin;
      dy = -dy;
    }
    if (y > window.innerHeight - margin - blobSize) {
      y = window.innerHeight - margin - blobSize;
      dy = -dy;
    }
    blob.setAttribute('x', x);
    blob.setAttribute('y', y);
    blob.setAttribute('dx', dx);
    blob.setAttribute('dy', dy);
    blob.style.left = x + 'px';
    blob.style.top = y + 'px';
  }
}

setInterval(moveBlobs, 25);

//document.body.style.backgroundColor = 'black';

var blobColors = ['rgba(255,0,0,0.5)', 'rgba(255,127,0,0.5)', 'rgba(255,255,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)', 'rgba(75,0,130,0.5)', 'rgba(143,0,255,0.5)'];
for (var i = 0; i < blobCount; i++) {
  var blob = blobArray[i];
  blob.style.backgroundColor = blobColors[i % blobColors.length];
}

var background = document.createElement('div');
background.setAttribute('style', 'position:fixed;top:0px;left:0px;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:-2;');
document.body.appendChild(background);

background.style.zIndex = -1;

for (var i = 0; i < blobCount; i++) {
  var blob = blobArray[i];
  blob.style.boxShadow = '0px 0px 100px ' + blob.style.backgroundColor;
}

background.style.backgroundColor = '#0000';

background.style.backdropFilter = 'blur(20px)';
background.style.webkitBackdropFilter = 'blur(20px)';

document.body.style.overflowX = 'hidden';
});
