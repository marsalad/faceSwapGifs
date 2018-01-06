// on load, display 4 trending GIFs
$(document).ready(function() {
  getGifs('');
})

// run search when user presses enter
$('#search-bar').keypress(function(e) {
  if (e.keyCode == 13) {
    search();
  }
})

// change the background image of an html element
function setImg(element, img) {
  element.style.backgroundImage = 'url(' + img + ')';
}

// get the background image of an html element
function getImg(element) {
  var style = element.currentStyle || window.getComputedStyle(element, false);
  return style.backgroundImage.slice(4, -1);
}

// pull top 4 GIFs based on search terms
function search() {
  getGifs(document.getElementById('search-bar').value.replace(/\s/g, '+'));
}

// user selects the GIF to faceswap
function selectGif(caller) {
  setImg(document.getElementById('input-gif'), getImg(caller));
}

// update GIFs per user specified search terms, default is trending
function getGifs(query) {
  $.ajax({
    url: 'https://us-central1-faceswapgifs.cloudfunctions.net/queryGiphy',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    data: {
      query: query,
      limit: limit
    },
    success: function(data) {
      var gifs = document.getElementById('search-results').children;
      for (var i = 0; i < limit; i++) {
        setImg(gifs[i], data[i].images.downsized_medium.gif_url);
      }
    }
  });
}