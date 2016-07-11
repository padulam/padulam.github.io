var temperature;

$(document).ready(function() {
  var latlong;
  var getZip = $.get("https://freegeoip.io/json/", function(response) {
  latlong = response.latitude + ", " + response.longitude;
  $('#location').html(response.city + " , " + response.region_name);
  }, "jsonp");

  $.ajax({
    url: 'https://freegeoip.net/json/',
    type: 'GET',
    dataType: 'jsonp',
    success: function(response){
      getWeather(response.latitude + ", " + response.longitude, 
          response.city, response.region_name);
    }
  });
});

function getWeather(longlat,city,state){
  $.ajax({
    url: 'https://api.forecast.io/forecast/'+ //YOUR API KEY* 
      +'/' + longlat,
    type: 'GET',
    dataType: 'jsonp',
    success: function(response){
      populateWeather(response);
    }
  });
}

function populateWeather(data){
  var backgroundURL;
  var weatherBackground = {
    snow: '../../images/cold-snow-landscape-nature.jpg',
    rain: '../../images/red-glass-rainy-rain.jpg',
    sunny: '../../images/sunny-beach-summer-path.jpg',
    cloudy: '../../images/sea-nature-beach-clouds.jpg',
    night: '../../images/sky-clouds-moon-horizon.jpg',
    thunderstorm: '../../images/city-lights-night-clouds.jpg'
  };

  temperature = data.currently.temperature;

  switch (data.currently.icon) {
    case "clear-day":
      backgroundURL = weatherBackground['sunny'];
      break;
      
    case "partly-cloudy-night":
    case "clear-night":
      backgroundURL = weatherBackground['night'];
      break;

    case "partly-cloudy-day":
      backgroundURL = weatherBackground['cloudy'];
      break;

    case "snow":
      backgroundURL = weatherBackground['snow'];
      break;

    case "Rain":
      backgroundURL = weatherBackground['rain'];
      break;

    case "thunderstorm":
      backgroundURL = weatherBackground['thunderstorm'];
      break;
  }

  $('#mainScreen').css('background-image', 'url(' + backgroundURL + ')')
  $('#temp').html(Math.round(temperature) + '&#8457');
  $('#weatherPic').addClass("wi-forecast-io-" + data.currently.icon);
  $('#weatherDescription').html(data.currently.summary);
};

function celToFar(temp) {
  return Math.round((temp * 1.8000 + 32.00));
};

$('#unitOfDegrees').click(function() {
  if ($(this).hasClass('fahrenheit')) {
    $(this).html('Switch to Fahrenheit');
    $(this).removeClass('fahrenheit');
    $(this).addClass('celsius')
    $('#temp').html(farToCel(temperature) + '&#8451');
  } else {
    $(this).html('Switch to Celsius');
    $(this).removeClass('celsius');
    $(this).addClass('fahrenheit');
    $('#temp').html(Math.round(temperature) + '&#8457');
  }
});