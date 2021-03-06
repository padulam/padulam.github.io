var calculate = "";
var awaitNum;

$(".num").click(function() {
  if (awaitNum) {
    $("#enteredNumber").html('');
    awaitNum = false
  }
  var currNum = $("#enteredNumber").html();
  if (!($(this).html() === "0" && currNum.length === 0||
      $(this).html() === "." && currNum.indexOf(".") > -1)) {
    $("#enteredNumber").html(trimToFit(currNum + $(this).html()));
    currNum = $("#enteredNumber").html();
  }
})

$(".operand").click(function() {
  var operands = {"÷": "/","x":"*"};

  if ($('#enteredNumber').html().length > 0) {
    var currOperand = $(this).html();
    if (currOperand === "√") {
      calculate = calculate + $("#enteredNumber").html()
      $('#enteredNumber').html(trimToFit(Math.sqrt(getEquals(calculate))));
    } else if (currOperand === "%") {
      if(calculate.length>0){
        calculate = "(" + calculate.slice(0, calculate.length - 1) + ")" + "*" + $("#enteredNumber").html();
      } else{
        calculate = $("#enteredNumber").html();
      }
    
      $('#enteredNumber').html(trimToFit(getEquals(calculate) / 100));
    }
    awaitNum = true;

    calculate+= $("#enteredNumber").html() + (operands[currOperand]||currOperand);
  }
})

$("#equals").click(function() {
  if (calculate.length > 0) {
    calculate = calculate + $("#enteredNumber").html();
    $('#enteredNumber').html(getEquals(calculate));
  }
})

$("#clearAll").click(function() {
  calculate = "";
  awaitNum = false;
  $("#enteredNumber").html('');
})

$('#clearEntry').click(function() {
  $("#enteredNumber").html('');
})

function getEquals(calc) {
  var equals = String(eval(calc));
  equals = equals.slice(0, 10)
  calculate = "";
  awaitNum = true;
  return equals;
}

function trimToFit(s) {
  s = String(s);
  return s.slice(0, 10)
}