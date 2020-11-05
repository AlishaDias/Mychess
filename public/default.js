var board;
var game= new Chess();
window.onload = function(){
  initGame();
};
//setup socket client
var socket = io();
var url_string=(window.location.href).toLowerCase();
  var url = new URL(url_string);
  

document.addEventListener('DOMContentLoaded',() =>{

var countdownEl=document.getElementById("countdown")
var startBtn = document.getElementById("start-button")
var startMinutes=url.searchParams.get("time");
let time= startMinutes * 60

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


startBtn.addEventListener('click',countdown)
})

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
    
};

var handleMove =function(source,target){
    var move=game.move({from:source, to:target});
    if (move === null) return 'snapback';
    else socket.emit("move",move);
};

//called when the server calls socket.broadcast('move')
socket.on('move',function(msg){
    game.move(msg);
    board.position(game.fen());//fen is the board layout
});
