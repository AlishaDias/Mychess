var board;
var game;

window.onload = function(){
  initGame();
  prepareJitsiFrame();
};
//to display checkmate condition
function checkStatus(){
  if (game.in_checkmate()) {
    alert("GAME OVER!");
  }
}
//setup socket client
var socket = io();
var url_string=(window.location.href).toLowerCase();
var url = new URL(url_string);
var ori=url.searchParams.get("orientation");
var boardroom=url.searchParams.get("boardroom");
var user=url.searchParams.get("user");

//livecamera iframe function
function prepareJitsiFrame() {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src","https://meet.jit.si/" +boardroom +"#userInfo.displayName=%22" + user +"%22");
  ifrm.style.width = "100%";
  ifrm.style.height = "100%";
  ifrm.allow = "camera; microphone; fullscreen; display-capture;";
  document.getElementById("livecamera").appendChild(ifrm);
}

var initGame = function(){
    var cfg ={
        draggable: true,
        orientation: ori,
        position: 'start',
        onDragStart: controlTurnBasedMove,
        onDrop: handleMove,    
    };
    board = new ChessBoard('gameBoard',cfg);
    game = new Chess();
};

//OnDragStart function
var controlTurnBasedMove = function ( piece, orientation) {
  // do not pick up pieces if the game is over
  //if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
  //only allow user to play their pieces
  if (
    (game.turn() === "w" && orientation === "black") ||
    (game.turn() === "b" && orientation === "white")
  ) {
    return false;
  }
};

//onDrop piece function
var handleMove =function(source,target){
    var move=game.move({from:source, to:target});
    if (move === null) return 'snapback';  
      socket.emit("move",move);
      changeTimer(); 
      //checkStatus();     
};

function changeTimer(){
  if ((game.turn() === "w" && ori === "white") ||(game.turn() === "b" && ori === "black")) {
    resumeCountdown2()
    pauseCountdown1()
    countdown2()
   }
   else if ((game.turn() === "b" && ori === "white")||(game.turn() === "w" && ori === "black")){
    resumeCountdown1()
    pauseCountdown2()
    countdown1()
   }
}

//called when the server calls socket.broadcast('move')
socket.on('move',function(msg){
  game.move(msg);
  board.position(game.fen());//fen is the board layout
  changeTimer();
  //checkStatus();
});


