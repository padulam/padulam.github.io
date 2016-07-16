$('#searchBox').keyup(function() {
  $('#randomContainer').hide();
  var pixels = -(1 / 100 * $('#titleRow').height());
  $('#titleRow').animate({
    marginTop: pixels
  })
  search($('#searchBox').val());
})

function search(parameter) {
  var results = [];
  var url;
  $('#searchResults').empty()
  $('#searchResults').hide()
  if (parameter.length > 0) {
    var wikiSearch = $.getJSON("https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&callback=?&srsearch=" + parameter, function(response) {
      var titles = response.query.search.map(function(result) {
        results.push(result.title);
        url = formatUrl(result.title)
        $("#searchResults").append("<li class='search-result'><a href='" + url + "' class='search-link' target='_blank'><span class='header'>" + result.title + "</span><br/><br/>" + result.snippet + "</a></li>")

      })
    })

    $.when(wikiSearch).done(function() {
      $('#searchBox').autocomplete({
        source: results.slice(0, 4),
        select: function(event, ui) {
          search(ui.item.value);
        }
      })
      $('#searchResults').fadeIn(1000)
    })
  } else {
    $('#randomContainer').show();
    $('#searchResults').empty();
  }
}

function formatUrl(title) {
  return "https://en.wikipedia.org/wiki/" + title.replace(/\s/g, "_")
}