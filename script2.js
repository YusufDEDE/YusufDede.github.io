var time=0;
var TimerTurn=true;
var TimerBarStop=true;
var origBoard; //an array that keeps track of what's in each square: X, O or nothing
const OPlayer = 'O';
const aiPlayer = 'X';

const winCombos = [  //array thats gonna show winning combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

var turn_count = 0;
const cells = document.querySelectorAll('.cell'); // cells variable is going to store a reference to each element that has a class 'cell'
startGame(); // calling function to start the game



//defining the function to start the game (it will also run when clicking on the "Replay" button)
function startGame() {
  TimerTurn=true;
  TimerBarStop=true;
  progress(5,10, $('#progressBar'));
  turn_count=0;
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys()) //make the array every number from 0-9
  for (var i=0; i< cells.length; i++) {
  cells[i].innerText = ''; //there will be nothing in the cell
  cells[i].style.removeProperty('background-color'); // removing the background color
  cells[i].addEventListener('click',turnClick, false); //calling the turnClick function

    }
}


//defining turnClick function
function turnClick (square) {
  console.log(square);
    if (typeof origBoard[square.target.id] === 'number') { //if id that was just clicked is a number, that means no one played in this spot
      if (turn_count % 2 == 0)
      {
        turn(square.target.id, OPlayer); //human player taking a turn
        TimerTurn=false;
        checkTie();
      }
      else {
        turn(square.target.id, aiPlayer); //human player taking a turn
        TimerTurn=true;
        checkTie();
      }
      turn_count++;
    }
}


//defining turn function
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;  // updating the display so we can see where player clicked
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)  // whenever the turn has been taken we're going to check if the game has been won

}


// defining checkWin function
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
  (e === player) ? a.concat(i) : a, []); //finding every index that the player has played
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) { //checking if the game has been won by looping through every winCombos
    if (win.every(elem => plays.indexOf(elem) > -1)) { //has the player played in every spot that counts as a win for that win
      gameWon = {index: index, player: player};  //which win combo the player won at & which player had won
      break;
    }
}
return gameWon;
}


//defining gameOver function
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) { //going through every index of the WinCombos
    document.getElementById(index).style.backgroundColor = gameWon.player === OPlayer ? "#4da6ff" : "#ff0000"; //if the human won-set background color to blue, if AI won-set background color to red
}
  for (var i= 0; i < cells.length; i++ ) { //making sure we cannot click on the cells anymore
    cells[i].removeEventListener('click', turnClick,false);

}
  declareWinner(gameWon.player === OPlayer ? "You win!" : "You lose."); //if human Player won show "You win!", otherwise show "You lose."
  TimerBarStop=false;
}


//defining declareWinner function
function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

//defining emptySuares function
function emptySquares() {
    return origBoard.filter(s => typeof s === 'number'); //filter every element in the origBoard to see if the type of element equals number. If yes, we are gonna return it (all the squares that are numbers are empty, the squares with X and O are not empty)

}


//defining bestSpot function
function bestSpot() {

    return emptySquares()[0];


}


//defining checkTie function
function checkTie() {
  if (emptySquares().length === 0) { //if every squre is filled up &nobody has won then it's a tie
    for (var i = 0; i < cells.length; i++) {
       cells[i].style.backgroundColor = "#66ff66"; //setting the background color to green
       cells[i].removeEventListener('click', turnClick, false); //makindeclareWinner(gameWon.player === OPlayer ? "You win!" : "You lose.");g sure user cannot click anywhere as the game is over

      }
    declareWinner("Berabere!")
    TimerBarStop=false;

    return true; //returning true as it's a tie
}
return false;
}


function progress(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element.find('div').animate({ width: progressBarWidth }, 600).html(Math.floor());
    if(timeleft > 0 && timeleft<10) {
        setTimeout(function() {
            if(TimerTurn==false){
                if(TimerBarStop){progress(timeleft +1, timetotal, $element);}

            }
            else{
                if(TimerBarStop){progress(timeleft -1, timetotal, $element);}

            }


        }, 1000);

      }
      if(timeleft==0){
          for (var i= 0; i < cells.length; i++ ) { //making sure we cannot click on the cells anymore
            cells[i].removeEventListener('click', turnClick,false);

            }
        declareWinner("X Kazandı!");
      }
      if(timeleft==10){
          for (var i= 0; i < cells.length; i++ ) { //making sure we cannot click on the cells anymore
            cells[i].removeEventListener('click', turnClick,false);
            }
        declareWinner("O Kazandı!");
      }
};
