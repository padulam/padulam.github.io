var computerToken;
var userToken;
var TicTacToeBoard = [];
var winner = "";

$(document).ready(function() {
  newGame();
  playerChoice();
})

//Resets game and displays token selection menu
function newGame() {
  TicTacToeBoard = clearBoard(TicTacToeBoard);
  updateBoard(TicTacToeBoard);
  if(winner===computerToken){
    uiMakeMove(computerToken,takeTurn(TicTacToeBoard,computerToken));
  }
}

//Brings up dialog box so the player can select their token
function playerChoice(){
  $(function() {
    $("#dialog").dialog({
      modal:true
    });
    $("#dialog").prev('.ui-dialog-titlebar').css("background", 
        "#5a5c51").css("border-color", "black");

    $('#xButton').click(function() {
      userToken = "X";
      computerToken = "O";
      $("#dialog").dialog('close');
    });

    $('#oButton').click(function() {
      userToken = "O";
      computerToken = "X";
      $("#dialog").dialog('close');
    });
  });
}

//Clears board array and pushes 9 null values for each space on the board
function clearBoard(board){
  board = [];
  while(board.length < 9){
    board.push(null);
  }
  return board;
}


//Returns the opponent of a given token
function getOpponent(token){
  if(token ==="X"){
    return "O";
  }
  return "X";
}

//Updates the user interface version of the board to reflect the values
//in the board array
function updateBoard(board){
  for(var i = 0;i<board.length;i++){
    if(board[i]!==null){
      $(".square").eq(i).html("<h1 class ='token'>"+ board[i]+ "</h1>");
    }else{
      $(".square").eq(i).empty();
    }
  }
}

//Clones board to return fresh board for each state
function cloneBoard(board){
  return board.slice(0);
}

//Handles ai moves without impacting ui
function aiMakeMove(board,player,location){
  var newBoard = cloneBoard(board);
  if(newBoard[location]===null){
      newBoard[location]=player;
      return newBoard;
  } else {
    return null;
  }   
}

//Main alphabeta function
function alphaBeta(board, player, alpha, beta){
  var val;
  if (gameOver(board)){
    switch(winner){
      case userToken:
        return -1;
      case computerToken:
        return 1;
      default:
        return 0;
    }
  }

  for (var i=0;i<board.length;i++){
      var newBoard = aiMakeMove(board,player,i);
      if(newBoard){
        val = alphaBeta(newBoard,getOpponent(player), alpha, beta);

        if(player === computerToken){
          if (val>alpha){
            alpha = val;
          }        
          if(alpha>=beta){
            return beta;
          }
        } else{
          if(val<beta){
            beta = val;
          }
          if(beta<=alpha){
            return alpha;
          }
        }
      }
  }

  if(player===computerToken){
    return alpha;
  } else{
    return beta;
  }
}

//Wrapper function. Kicks offs minimax algorithm with alpha/beta pruining
function takeTurn(board,player){
  var a = -2;
  var choices = [];
  var val;

  for(var i = 0;i<board.length;i++){
    var newBoard = aiMakeMove(board,player,i);
    if(newBoard){
      val = alphaBeta(newBoard,getOpponent(player), -2, 2);

      if (val > a){
        a = val;
        choices = [i];
      }else if(val===a){
        choices.push(i);
      }
    }
  }
  return choices[0];
}

//Handles user's moves
function uiMakeMove(player,location){
  if(TicTacToeBoard[location]===null){
    TicTacToeBoard[location] = player;
    updateBoard(TicTacToeBoard);

    if(gameOver(TicTacToeBoard)){
      if(winner ===computerToken){
        alert(computerToken + " wins!");
      }else if(winner ===userToken){
        alert(userToken + " wins!");
      } else{
        alert("Tie!");
      }
      newGame();
      return false;
    }
    return true;
  }
  return false;
}

//Checks whether the game is over and whether it's a win or tie
function gameOver(board) {
  //Checks for horizontal wins
  for (var i = 0; i <= 6; i += 3) {
    if (board[i] !==null && board[i] === board[i + 1] && board[i] === 
          board[i + 2]) {
      winner = board[i];
      return true;
    }
  }

  //Checks for vertical wins
  for (var i = 0; i <= 2; i++) {
    if (board[i] !==null && board[i] === board[i + 3] && board[i] === 
          board[i + 6]) {
      winner = board[i];
      return true;
    }
  }

  //Checks for diagonal wins
  if (board[0] !==null && board[0] === board[4] && board[0] === 
        board[8]) {
    winner = board[0];
    return true;

  } else if(board[2] !==null && board[2] === board[4] && board[2] 
      === board[6]) {
    winner = board[2];
    return true;
  }

  //Checks for ties
  for(var i = 0;i<board.length;i++){
    if(board[i]===null){
      return false;
    } else if(i===8){
      winner = "";
      return true;
    }
  }
}

$('.square').click(function() {
  if(uiMakeMove(userToken, $(this).index())){
    uiMakeMove(computerToken,takeTurn(TicTacToeBoard,computerToken));
  }
});