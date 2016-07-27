var on = false;
var strict = false;
var moves = [];
var playerTurn = false;
var computerDelay = 750;
var lightDelay = 300;
var playerTimer = 3000;
var maxMove = 20;
var moveCount = 0;
var gameTimeout;
var runTimer;
var buttonIds = ['green', 'red', 'yellow', 'blue'];
var greenAudio =
    new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var redAudio =
    new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var yellowAudio =
    new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var blueAudio =
    new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')

$('#power').click(function() {
    if (on === false) {
        on = true;
        $('#screenText').css('color', 'red');
        $('#powerSignal').css('background-color', 'lime');
    } else {
        clearTimeout(gameTimeout);
        clearInterval(runTimer)
        on = false;
        strict = false;
        moves = [];
        moveCount = 0;
        playerTurn = false;
        $('#screenText').stop();
        $('#screenText').css('color', '#430710').text('--');
        $('#strictSignal').css('color', '#430710');
        $('#powerSignal').css('background-color', 'black');
    }
});

$('#strict').click(function() {
    if (on && strict === false) {
        $('#strictSignal').css('color', '#f4df24');
        strict = true;
    } else {
        $('#strictSignal').css('color', '#430710');
        strict = false;
    }
});

$('#topLeft').click(function() {
    if (playerTurn) {
        clearTimeout(gameTimeout);
        greenClick();
        nextGameEvent(validateMove('green', moveCount += 1, moves));
    }
});

$('#topRight').click(function() {
    if (playerTurn) {
        clearTimeout(gameTimeout);
        redClick();
        nextGameEvent(validateMove('red', moveCount += 1, moves));
    }
});

$('#bottomLeft').click(function() {
    if (playerTurn) {
        clearTimeout(gameTimeout);
        yellowClick();
        nextGameEvent(validateMove('yellow', moveCount += 1, moves));
    }
});

$('#bottomRight').click(function() {
    if (playerTurn) {
        clearTimeout(gameTimeout);
        blueClick();
        nextGameEvent(validateMove('blue', moveCount += 1, moves));
    }
});

$('#start').click(function() {
    startGame();
});

function greenClick() {
    if (on) {
        greenAudio.play();
        $('#topLeft').addClass('green-light');
        setTimeout(function() {
            $('#topLeft').removeClass('green-light');
        }, lightDelay);
    }
}

function redClick() {
    if (on) {
        redAudio.play();
        $('#topRight').addClass('red-light');
        setTimeout(function() {
            $('#topRight').removeClass('red-light');
        }, lightDelay);
    }
}

function yellowClick() {
    if (on) {
        yellowAudio.play();
        $('#bottomLeft').addClass('yellow-light');
        setTimeout(function() {
            $('#bottomLeft').removeClass('yellow-light');
        }, lightDelay);
    }
}

function blueClick() {
    if (on) {
        blueAudio.play();
        $('#bottomRight').addClass('blue-light');
        setTimeout(function() {
            $('#bottomRight').removeClass('blue-light');
        }, lightDelay);
    }
}

//Checks to see what the next event in game event is
function nextGameEvent(moveCorrect) {
    if (gameOver(moveCorrect, false, moveCount) === false) {
        if (moveCount === moves.length) {
            playerTurn = false;
            moveCount = 0;
            createMoves();
        }
    }
}

//Runs array of moves 
function runMove(move) {
    switch (move) {
        case 'green':
            greenClick();
            break;
        case 'red':
            redClick();
            break;
        case 'yellow':
            yellowClick();
            break;
        case 'blue':
            blueClick();
            break;
    }
}

function startGame() {
    if (on) {
        $('#screenText').stop();
        moves = [];
        moveCount = 0;
        playerTurn = false;
        $('#screenText').text('--');
        clearTimeout(gameTimeout);
        clearInterval(runTimer);
        var startDelay = setInterval(function() {
            clearInterval(startDelay);
            createMoves();
        }, 1000)
    }
}

function createMoves() {
    moves = chooseMove(moves);
    $('#screenText').text(formatNumber(moves.length));
    runGame();
}

//Chooses a random move and pushes it to the move array
function chooseMove(arr) {
    var rand = Math.floor(Math.random() * 4)
    arr.push(buttonIds[rand]);
    return arr;
}

//ToDo: need to wrap setInterval
function runGame() {
    var i = 0;

    runTimer = setInterval(function() {
        runMove(moves[i]);
        if (i === moves.length - 1) {
            playerTurn = true;
            clearInterval(runTimer);
            gameTimeout = setTimeout(function() {
                gameOver(false, true, moveCount);
            }, playerTimer);
        }
        i++;
    }, computerDelay);
}

//Determines whether game should end
function gameOver(moveMatch, overTime, count) {
    //User has correctly made the maximium number of moves
    if (moveMatch === true && overTime === false && count === maxMove) {
        playerTurn = false;
        moveCount = 0;
        clearInterval(runTimer);
        flashScreenText('**', true);
        return true;

        //User made wrong move or ran over time in strict mode
    } else if ((moveMatch === false || overTime === true) && strict) {
        playerTurn = false;
        moveCount = 0;
        clearInterval(runTimer);
        flashScreenText('!!', true);
        return true;
    }

    //User made wrong move or ran out of time outside of strict mode
    if (moveMatch === false || overTime === true) {
        playerTurn = false;
        moveCount = 0;
        clearInterval(runTimer);
        flashScreenText('!!', false);
    }
    return false;
}

//Checks to see if player has made correct move
function validateMove(move, count, moveArray) {
    if (moveArray[count - 1] !== move) {
        moveCount -= 1;
        return false;
    } else {
        return true;
    }
}

function formatNumber(num) {
    if (num < 10) {
        return '0' + num;
    }
    return num;
}

function flashScreenText(val, endGame) {
    $('#screenText').text(val);
    for (var i = 0; i < 4; i++) {
        $('#screenText').fadeOut(100);
        $('#screenText').fadeIn(100);
    }

    $('#screenText').fadeOut(100);
    $('#screenText').fadeIn(100, function() {
        if (on) {
            $('#screenText').text(formatNumber(moves.length));
        }
        if (endGame) {
            startGame();
        } else {
            runGame();
        }
    });
}
