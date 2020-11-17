var board;
var game;
var md = new MobileDetect(window.navigator.userAgent);


console.log( md.mobile() );          // 'Sony'
console.log( md.phone() );           // 'Sony'
console.log( md.tablet() );          // null
console.log( md.userAgent() );       // 'Safari'
console.log( md.os() );              // 'AndroidOS'
console.log( md.is('iPhone') );      // false
console.log( md.is('bot') );         // false
console.log( md.version('Webkit') );         // 534.3
console.log( md.versionStr('Build') );       // '4.1.A.0.562'
console.log( md.match('playstation|xbox') ); // false


//setup socket client
var socket = io();

//read parameters from URL
var url_string = window.location.href;
var url = new URL(url_string);
var ori = url.searchParams.get("orientation").toLowerCase();
var gameroom = url.searchParams.get("gameroom");
var user = url.searchParams.get("user");

// Join gameroom
// socket.on("connect", () => {
socket.emit("joinRoom", { gameroom });
// });

//HTML Parameters
var $status = $("#gamestatus");

window.onload = function () {
  initGame();
};

//Initalise the chessboard
var initGame = function () {
  var cfg = {
    draggable: true,
    orientation: ori,
    position: "start",
    onDragStart: controlTurnBasedMove,
    onDrop: handleMove,
    onSnapEnd: onSnapEnd,
  };

  prepareJitsiFrame();

  board = new ChessBoard("gameBoard", cfg);
  game = new Chess();
  updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  board.position(game.fen());
  changeTimer();
  updateStatus();
}

function updateStatus() {
  var status = "";

  var moveColor = "White";

  if (game.turn() === "b") {
    moveColor = "Black";
  }
  // check checkmate?
  if (game.in_checkmate()) {
    // alert("Game Over. " + moveColor + " is checkmate.");
    status = "Game Over. " + moveColor + " is checkmate.";
    pauseTimer();
  }

  // check draw?
  else if (game.in_draw()) {
    status = "Game over, drawn position";
    pauseTimer();
  }

  else if(game.game_over()){
    status ="Game Over!";
    pauseTimer();
  }

  // else if(time==-1 || opponenttime==-1){
  //   status ="Game Over!";
  //   pauseTimer();
  // }
  
  // game still on
  else {
    status = moveColor + "'s Turn";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " is in check position";
    }
  }
  
  $status.html(status);
}

//OnDragStart function
var controlTurnBasedMove = function (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }

  //only allow user to play their pieces
  if (
    (game.turn() === "w" && ori === "black") ||
    (game.turn() === "b" && ori === "white")
  ) {
    return false;
  }
};

//onDrop piece function
var handleMove = function (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  if (move === null) {
    return "snapback";
  } else {
    socketdata = { gameroom, move };
    try{
      socket.emit("move", { gameroom: gameroom, msg: move });
      console.log("Message Emited to: " + gameroom + " : Message: " + move);
    }
    catch(error){
      console.log(error.message +"at"+ gameroom);
    }
    
    // socket.to(gameroom).emit("move", move);
    // updateStatus();
    // changeTimer();
  }
  //checkStatus();
};

function changeTimer() {
  if (
    (game.turn() === "w" && ori === "white") ||
    (game.turn() === "b" && ori === "black")
  ) {
    resumeCountdown2();
    pauseCountdown1();
    countdown2();
  } else if (
    (game.turn() === "b" && ori === "white") ||
    (game.turn() === "w" && ori === "black")
  ) {
    resumeCountdown1();
    pauseCountdown2();
    countdown1();
  }
}

function pauseTimer() {
  pauseCountdown1();
  pauseCountdown2();
}

//called when the server calls socket.broadcast('move')
try{
  socket.on("move", ({ msg }) => {
    console.log("Message received: " + msg);
    game.move(msg);
    board.position(game.fen()); //fen is the board layout
    changeTimer();
    updateStatus();
  });
}
catch(error){
  console.log(error.message);
}


//livecamera iframe function
function prepareJitsiFrame() {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute(
    "src",
    "https://meet.jit.si/" +
      gameroom +
      "#userInfo.displayName=%22" +
      user +
      "%22"
  );
  ifrm.style.width = "100%";
  ifrm.style.height = "60%";
  ifrm.allow = "camera; microphone; fullscreen; display-capture;";
  document.getElementById("livecamera").appendChild(ifrm);
}

//http://localhost:3000/?user=White%20Player&opponent=Black%20Player&orientation=white&gameroom=UniqueRoom9211&gametime=10
