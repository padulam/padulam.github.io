var temperature;

$(document).ready(function() {
  var zip;
  var getZip = $.get("http://ipinfo.io", function(response) {
    zip = response.postal;
    $('#location').html(response.city + " , " + response.region);
  }, "jsonp");

  $.when(getZip).done(function() {
    $.get("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&APPID=5cb4268e79277a890113e3dff474cba8", function(response) {
      var backgroundURL;
      var weatherBackground = {
        snow: '../../images/cold-snow-landscape-nature.jpg',
        rain: '../../images/red-glass-rainy-rain.jpg',
        sunny: '../../images/sunny-beach-summer-path.jpg',
        cloudy: '../../images/sea-nature-beach-clouds.jpg',
        night: '../../images/sky-clouds-moon-horizon.jpg',
        thunderstorm: '../../images/city-lights-night-clouds.jpg'
      };

      var d = new Date();
      var weatherIcon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      temperature = response.main.temp;

      if (d.getHours() >= 18) {
        backgroundURL = weatherBackground['night'];
      } else {

        switch (response.weather[0].main) {
          case "Clear":
            backgroundURL = weatherBackground['sunny'];
            break;
            
          case "Clouds":
            if (response.weather[0].description === "clear sky") {
              backgroundURL = weatherBackground['sunny'];
            } else {
              backgroundURL = weatherBackground['cloudy'];
            }
            break;

          case "Snow":
            backgroundURL = weatherBackground['snow'];
            break;

          case "Drizzle":
          case "Rain":
            backgroundURL = weatherBackground['rain'];
            break;

          case "Thunderstorm":
            backgroundURL = weatherBackground['thunderstorm'];
            break;
        }
      }
      $('#mainScreen').css('background-image', 'url(' + backgroundURL + ')')
      $('#temp').html(kelToFar(response.main.temp) + '&#8457');
      $('#weatherPic').attr('src', weatherIcon);
      $('#weatherDescription').html(response.weather[0].description);
    });
  });
});

$('#unitOfDegrees').click(function() {
  if ($(this).hasClass('fahrenheit')) {
    $(this).html('Switch to Fahrenheit');
    $(this).removeClass('fahrenheit');
    $(this).addClass('celsius')
    $('#temp').html(kelToCel(temperature) + '&#8451');
  } else {
    $(this).html('Switch to Celsius');
    $(this).removeClass('celsius');
    $(this).addClass('fahrenheit');
    $('#temp').html(kelToFar(temperature) + '&#8457');
  }

});

function kelToFar(temp) {
  return Math.round((temp - 273.15) * 1.8000 + 32.00)
}

function kelToCel(temp) {
  return Math.round(temp - 273.15);
}