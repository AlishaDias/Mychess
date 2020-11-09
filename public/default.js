var board;
var game;

window.onload = function(){
  initGame();
};
//setup socket client
var socket = io();
var url_string=(window.location.href).toLowerCase();
var url = new URL(url_string);
  
//var countdownEl=document.getElementById("countdown")
//var countdownEl2=document.getElementById("countdown2")
var startMinutes=url.searchParams.get("time");
var startMinutes2=url.searchParams.get("opponenttime");
let time= startMinutes * 60;
let opponenttime=startMinutes2 * 60;

/*function countdown(){
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
*/
var current_time = Date.parse(new Date());
var deadline = new Date(current_time + startMinutes*60*1000);
var deadline2 = new Date(current_time + startMinutes2*60*1000);

  function time_remaining(endtime){
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
  }
//for timer1  
  var timeinterval;
  function run_clock(id,endtime){
    var clock = document.getElementById(id);
    function update_clock(){
      var t = time_remaining(endtime);
      clock.innerHTML = t.minutes+':'+t.seconds;
      if(t.total<=0){ clearInterval(timeinterval); }
    }
    update_clock(); // run function once at first to avoid delay
    timeinterval = setInterval(update_clock,1000);
  }
  
  
  var paused = false; // is the clock paused?
  var time_left; // time left on the clock when paused
  
  function pause_clock(){
    if(!paused){
      paused = true;
      clearInterval(timeinterval); // stop the clock
      time_left = time_remaining(deadline).total; // preserve remaining time
    }
  }
  
  function resume_clock(){
    if(paused){
      paused = false;
  
      // update the deadline to preserve the amount of time remaining
      deadline = new Date(Date.parse(new Date()) + time_left);
  
      // start the clock
      run_clock('clockdiv',deadline);
    }
  }
  // handle pause and resume button clicks
  document.getElementById('pause').onclick = pause_clock;
  document.getElementById('resume').onclick = resume_clock;  

//for timer2
var timeinterval2;

function run_clock2(id,endtime){
	var clock2 = document.getElementById(id);
	function update_clock2(){
		var t = time_remaining(endtime);
		clock2.innerHTML = t.minutes+':'+t.seconds;
		if(t.total<=0){ clearInterval(timeinterval2); }
	}
	update_clock2(); // run function once at first to avoid delay
	timeinterval2 = setInterval(update_clock2,1000);
}

run_clock('clockdiv2',deadline2);

function pause_clock2(){
	if(!paused){
		paused = true;
		clearInterval(timeinterval2); // stop the clock
		time_left = time_remaining(deadline2).total; // preserve remaining time
	}
}


function resume_clock2(){
	if(paused){
		paused = false;

		// update the deadline to preserve the amount of time remaining
		deadline2 = new Date(Date.parse(new Date()) + time_left);

		// start the clock
		run_clock2('clockdiv2',deadline2);
	}
}


document.getElementById('pause2').onclick = pause_clock2;
document.getElementById('resume2').onclick = resume_clock2;


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
      var moveColor = 'White'
      if (game.turn() === 'b') {
      moveColor = 'Black'
  
      
    }
    if (moveColor='White'){
      run_clock('clockdiv',deadline);
    }
    else {
      run_clock('clockdiv2',deadline2);
    } 
  }
};

//called when the server calls socket.broadcast('move')
socket.on('move',function(msg){
    game.move(msg);
    board.position(game.fen());//fen is the board layout
});
