var myInterval;
var sessionTime = true;
var audio = new Audio("../../sounds/EndChime.mp3");

$(document).ready(function() {
  $('#mainTimer').val($('#session').val());
})

$('#downSession').click(function() {
  countSet('#session', false);
  setMainTimer();
})

$('#upSession').click(function() {
  countSet('#session', true);
  setMainTimer();
})

$('#downBreak').click(function() {
  countSet('#break', false);
  setMainTimer();
})

$('#upBreak').click(function() {
  countSet('#break', true);
  setMainTimer();
})

function setMainTimer() {
  if (sessionTime) {
    $("label[for='mainTimer']").html("Session")
    $('#mainTimer').val($('#session').val());
  } else {
    $("label[for='mainTimer']").html("Break")
    $('#mainTimer').val($('#break').val());
  }
}

function countSet(e, up) {
  var counterVal = parseInt($(e).val())

  if (up === true) {
    $(e).val(counterVal + 1);
  } else {
    if (counterVal > 1) {
      $(e).val(counterVal - 1);
    }
  }
}

function stop() {
  clearInterval(myInterval);
}

function reset() {
  sessionTime = true;
  setMainTimer();
}

$("#start").click(function() {
  start();
});

$("#stop").click(function() {
  stop();
})

$("#reset").click(function() {
  reset();
})

function start() {
  myInterval = setInterval(timer, 1000)
}

function timer() {
  var time = $("#mainTimer").val();
  if (time.length <= 2) {
    time += ":00";
  }
  var splitTime = time.split(":");
  if (splitTime[1] > 0) {
    splitTime[1] -= 1;
    $("#mainTimer").val(splitTime[0] + ":" + padZeros(splitTime[1]));
  } else if (splitTime[0] > 0) {
    splitTime[1] = 59;
    splitTime[0] -= 1;
    $("#mainTimer").val(splitTime[0] + ":" + padZeros(splitTime[1]));
  } else {
    audio.play();
    sessionTime = !sessionTime
    setMainTimer();
  }
}

function padZeros(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}