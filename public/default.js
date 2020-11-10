var board;
var game;
var myinterval=-1;
var myinterval2=-1;
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

var start=document.getElementById("start");
var test=document.getElementById("test");

  function countdown(){         //for timer 1
    clearInterval(myinterval);
    myinterval=setInterval(function(){
      if (countdownEl<=0){
        clearInterval(countdownEl=0)
      }
      var minutes= Math.floor(time/60);
      let seconds=time % 60;
      minutes =minutes < 10 ? '0'+minutes:minutes;
      seconds =seconds < 10 ? '0'+seconds:seconds;
      clockdiv.innerHTML = minutes + ":" + seconds;
      time--;
    },1000);
  }
  start.addEventListener("click",function(event){   //onclicking start button
    if(myinterval==-1){
      myinterval=setInterval(function(){
        if (countdownEl<=0){
          clearInterval(countdownEl=0)
        }
        var minutes= Math.floor(time/60);
        let seconds=time % 60;
        minutes =minutes < 10 ? '0'+minutes:minutes;
        seconds =seconds < 10 ? '0'+seconds:seconds;
        clockdiv.innerHTML = minutes + ":" + seconds;
        time--;
      },1000);
    }
    else{
      clearInterval(myinterval);
      myinterval=-1;
    }
  });
  

function countdown2(){              //for timer 2
  setInterval(function(){
    if (countdownEl2<=0){
      clearInterval(countdownEl2=0)
    }
    var mins= Math.floor(time/60);
    let sec=opponenttime % 60;
    mins =mins < 10 ? '0'+mins:mins;
    sec =sec < 10 ? '0'+sec:sec;
    clockdiv2.innerHTML = mins + ":" + sec;
    opponenttime--;
  },1000)
}
test.addEventListener("click",function(event){        //onclicking test button
  if(myinterval2==-1){
    myinterval2=setInterval(function(){
      if (countdownEl2<=0){
        clearInterval(countdownEl2=0)
      }
      var mins= Math.floor(opponenttime/60);
      let sec=opponenttime % 60;
      mins =mins < 10 ? '0'+mins:mins;
      sec =sec < 10 ? '0'+sec:sec;
      clockdiv2.innerHTML = mins + ":" + sec;
      opponenttime--;
    },1000);
  }
  else{
    clearInterval(myinterval2);
    myinterval2=-1;
  }
});

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
    else {
      socket.emit("move",move);
      countdown();//starts after the first move
  }
};

//called when the server calls socket.broadcast('move')
socket.on('move',function(msg){
  game.move(msg);
  board.position(game.fen());//fen is the board layout
});



