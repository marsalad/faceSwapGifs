var limit = 4; // number of GIFs to display

var loading = 'img/spinner.gif'; // loading animation

var gifIO = {
  element: document.getElementById("input-gif"),
  default: 'img/selectgif-white.png',
}
var imgIO = {
  element: document.getElementById("input-img"),
  default: 'img/uploadselfie-white.png',
  hover: 'img/uploadselfie-silver.png',
  empty: true
}
var swapIO = {
  element: document.getElementById("output-gif"),
  default: 'img/faceswap-white.png',
  hover: 'img/faceswap-silver.png',
  empty: true
}

setImg(gifIO.element, gifIO.default);
initIOObject(imgIO);
initIOObject(swapIO);

function initIOObject(object) {
  setImg(object.element, object.default);
  new Image().src = object.hover; // preload

  object.element.onmousemove = function() {
    if (object.empty) {
      setImg(object.element, object.hover);
    }
  }
  object.element.onmouseout = function() {
    if (object.empty) {
      setImg(object.element, object.default);
    }
  }
}