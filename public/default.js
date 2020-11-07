var board;
var game;

window.onload = function(){
  initGame();
};
//setup socket client
var socket = io();
var url_string=(window.location.href).toLowerCase();
var url = new URL(url_string);
  
var countdownEl=document.getElementById("countdown")
var countdownEl2=document.getElementById("countdown2")
var startMinutes=url.searchParams.get("time");
var startMinutes2=url.searchParams.get("opponenttime");
let time= startMinutes * 60;
let opponenttime=startMinutes2 * 60;

function countdown(){
  setInterval(function(){
    if (countdownEl<=0){
      clearInterval(countdownEl=0)
    }
    var minutes= Math.floor(time/60);
    let seconds=time % 60;
    seconds =seconds < 10 ? '0'+seconds:seconds;
    countdownEl.innerHTML = minutes + ":" + seconds;
    time--;
  },1000)
}
function countdown2(){
  setInterval(function(){
    if (countdownEl2<=0){
      clearInterval(countdownEl2=0)
    }
    var mins= Math.floor(time/60);
    let sec=opponenttime % 60;
    sec =sec < 10 ? '0'+sec:sec;
    countdownEl2.innerHTML = mins + ":" + sec;
    opponenttime--;
  },1000)
}

var initGame = function(){
  
  var ori=url.searchParams.get("orientation");
  
    var cfg ={
        draggable: true,
        orientation: ori,
        position: 'start',
        onDrop: handleMove,
        
    };
    board = new ChessBoard('gameBoard',cfg);
    game = new Chess();
    updateStatus();
    
    
};

var handleMove =function(source,target){
    var move=game.move({from:source, to:target});
    if (move === null) return 'snapback';
    else {
      socket.emit("move",move);
      var moveColor = 'White'
      if (game.turn() === 'b') {
      moveColor = 'Black'
  
      if (moveColor='White'){
        countdown();
      }
      else {
        countdown2();
      } 
    }}
};

//called when the server calls socket.broadcast('move')
socket.on('move',function(msg){
    game.move(msg);
    board.position(game.fen());//fen is the board layout
});
