const limit = 4; // number of GIFs to display

// On load, display 4 trending GIFs
$(document).ready(function() {
  getGifs('');
})

// Run search when user presses enter
$('#search-bar').keypress(function(e) {
  if (e.keyCode == 13) {
    search();
  }
})

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
      for (var i = 0; i < limit; i++) {
        document.getElementById('search-results').children[i].children[0].src = 
          data[i].images.downsized_medium.gif_url;
      }
    }
  });
}

// Pull top 4 GIFs based on search terms
function search() {
  getGifs(document.getElementById('search-bar').value.replace(/\s/g, '+'));
}

// User selects the GIF to faceswap
function selectGif(caller) {
  document.getElementById('input-gif').children[0].src = caller.src;
}

// create and display face-swapped GIF
function swapFaces() {
  if (!document.getElementById('input-gif')) {
    alert('Please select a GIF.');
    return;
  } else if (!document.getElementById('input-img')) {
    alert('Please upload an image.');
    return;
  }

  var swap = document.getElementById('output-gif').children[0];
  swap.src = 'img/spinner.gif';
  $.ajax({
    url: 'https://us-central1-faceswapgifs.cloudfunctions.net/swapFaces',
    type: 'POST',
    contentType:'application/json; charset=utf-8',
    data: JSON.stringify({
      gif: document.getElementById('input-gif').children[0].src, 
      img: document.getElementById('input-img').children[0].src
    }),
    success: function(data) {
      swap.src = data;
    },
    error: function() {
      alert('Error: could not swap faces');
      swap.src = '';
    }
  });
}