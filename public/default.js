var board;
var game;

window.onload = function(){
  initGame();
  prepareJitsiFrame();
};
//setup socket client
var socket = io();
var url_string=(window.location.href).toLowerCase();
var url = new URL(url_string);
var ori=url.searchParams.get("orientation");

function prepareJitsiFrame() {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("src","https://meet.jit.si/" +boardroom +"#userInfo.displayName=%22" + user +"%22");
  ifrm.style.width = "100%";
  ifrm.style.height = "100%";
  ifrm.allow = "camera; microphone; fullscreen; display-capture;";
  document.getElementById("livecamera").appendChild(ifrm);
}
/*
let myiframe=document.getElementById("frame");
let link="https://meet.jit.si/";
var gameid=url.searchParams.get("gameid");
console.log("gameid:",gameid);
let IframeUrl=link+"&gameid="+gameid;
console.log(IframeUrl);
myiframe.src=IframeUrl;*/


  // if (game.in_checkmate()) {
  //   alert("GAME OVER!");
  // }


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
    if (ori == 'white') {
        countdown2();
       }
};



var controlTurnBasedMove = function (source, piece, position, orientation) {
  console.log('Drag started:')
  console.log('Source: ' + source)
  console.log('Piece: ' + piece)
  console.log('Orientation: ' + orientation)

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
  // var moveColor = 'White'
  // if (game.turn() === 'b') {
  //   moveColor = 'Black',
  //   countdown();
  // }
  // else countdown2();
};

var handleMove =function(source,target){
    var move=game.move({from:source, to:target});
    if (move === null) return 'snapback';
    else {
      socket.emit("move",move);
      if (ori == 'white') {
        pause2()
        countdown()
       }
       else if(ori=='black'){
         
         resume()        
         pause2()   
       }
      }
};

//called when the server calls socket.broadcast('move')
socket.on('move',function(msg){
  game.move(msg);
  board.position(game.fen());//fen is the board layout
});


