var twitchStreams = ["freecodecamp", "storbeck", "terakilobyte", 
                      "habathcx", "RobotCaleb", "thomasballinger", 
                      "noobs2ninjas", "beohoff", "pandaxgaming", "brunofin"];

$(document).ready(function() {
  var chan = twitchStreams.map(function(stream) {
    var status;
    var game = "";
    var data;

    var twitchStreamData = $.get("https://api.twitch.tv/kraken/streams/" 
      + stream, function(response) {
      if (response.stream === null) {
        status = "silver"
      } else {
        status = "lime";
        game = resizeString(response.stream.game);
      }
    });

    var twitchChannelData = $.get("https://api.twitch.tv/kraken/channels/" 
      + stream, function(response) {
      data = response;

    }).fail(function() {
      $("#statusList").append('<li><img src="../../images/twitch-logo.png">'
          + '<div><span>' + stream + " " + '</span><i class="fa fa-circle-thin">' 
          + '</i></div><label>This stream is no longer available</label></li>')
    });

    $.when(twitchStreamData, twitchChannelData).done(function() {
      var channelLogo = data.logo || "../../images/twitch-logo.png";
      $("#statusList").append('<li><a href="' + data.url 
        + '" target="_blank"><img src="' + channelLogo + '"><div><span>' 
        + data.display_name + " " + '</span><i class="fa fa-circle" style' +
        '="color:' + status + '"></i></div><label>' + game 
        + '</label></a></li>')
    })
  })
});

$("#searchInput").on('input', function() {
  var searchVal = $("#searchInput").val().toLowerCase();
  var search = $('#statusList li').map(function(list) {
    if (searchVal.length > 0) {
      if ($(this).find("span").html().toLowerCase().indexOf(searchVal) < 0) {
        $(this).hide();
      }
    } else {
      $(this).show();
    }
  });
});

function resizeString(str) {
  if (str.length > 30) {
    return str.slice(0, 30) + "...";
  } else {
    return str
  }
}