var myinterval = -1;
var myinterval2 = -1;
var url_string = window.location.href.toLowerCase();
var url = new URL(url_string);

var countdownEl = document.getElementById("countdown");
var countdownEl2 = document.getElementById("countdown2");
var startMinutes = url.searchParams.get("gametime");
var startMinutes2 = url.searchParams.get("gametime");
var output = document.getElementById("clockdiv");
var output2 = document.getElementById("clockdiv2");
let time = startMinutes * 60;
let opponenttime = startMinutes2 * 60;

var countdown1ON = false;
var countdown2ON = false;

//countdown for timer1
function countdown1() {
  if (countdown1ON == false) {
    clearInterval(myinterval);
    myinterval = setInterval(function () {
      if (countdownEl <= 0) {
        clearInterval((countdownEl = 0));
      }
      var minutes = Math.floor(time / 60);
      let seconds = time % 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      clockdiv.innerHTML = minutes + ":" + seconds;
      time--;
      // if (time < -1) {
      //   alert("Time Over");
      //   clearInterval(myinterval);
      //   clockdiv.innerHTML = "00:00";
      // }
      if ((time==-1 && opponenttime!=-1 && ori=='white') || (time==-1 && opponenttime!=-1 && ori=='black')){
        pauseTimer();
        alert("You win! Game Over")
      }
      else if((opponenttime==-1 && time!=-1 && ori=='white')||(opponenttime==-1 && time!=-1 && ori=='black')){
        pauseTimer();
        alert("Oponnent Wins! Game Over");
      }
    }, 1000);
    countdown1ON = true;
  }
}

function pauseCountdown1() {
  clearInterval(myinterval);
  myinterval = -1;
}

function resumeCountdown1() {
  if (myinterval == -1) {
    myinterval = setInterval(function () {
      if (countdownEl <= 0) {
        clearInterval((countdownEl = 0));
      }
      var minutes = Math.floor(time / 60);
      let seconds = time % 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      clockdiv.innerHTML = minutes + ":" + seconds;
      time--;
    }, 1000);
  }
}

//countdown for timer2
function countdown2() {
  if (countdown2ON == false) {
    clearInterval(myinterval2); //for timer 2
    myinterval2 = setInterval(function () {
      if (countdownEl2 <= 0) {
        clearInterval((countdownEl2 = 0));
      }
      var mins = Math.floor(opponenttime / 60);
      let sec = opponenttime % 60;
      mins = mins < 10 ? "0" + mins : mins;
      sec = sec < 10 ? "0" + sec : sec;
      clockdiv2.innerHTML = mins + ":" + sec;
      opponenttime--;
      // if (opponenttime < -1) {
      //   alert("Time Over");
      //   clearInterval(myinterval2);
      //   clockdiv2.innerHTML = "00:00";
      // }
      if ((time==-1 && opponenttime!=-1 && ori=='white') || (time==-1 && opponenttime!=-1 && ori=='black')){
        pauseTimer();
        alert("You win! Game Over")
      }
      else if((opponenttime==-1 && time!=-1 && ori=='white')||(opponenttime==-1 && time!=-1 && ori=='black')){
        pauseTimer();
        alert("Oponnent Wins! Game Over");
      }
    }, 1000);
    countdown2ON = true;
  }
}

function pauseCountdown2() {
  clearInterval(myinterval2);
  myinterval2 = -1;
}

function resumeCountdown2() {
  if (myinterval2 == -1) {
    myinterval2 = setInterval(function () {
      if (countdownEl2 <= 0) {
        clearInterval((countdownEl2 = 0));
      }
      var mins = Math.floor(opponenttime / 60);
      let sec = opponenttime % 60;
      mins = mins < 10 ? "0" + mins : mins;
      sec = sec < 10 ? "0" + sec : sec;
      clockdiv2.innerHTML = mins + ":" + sec;
      opponenttime--;
      if (opponenttime < -1) {
        alert("Time Over");
      }
    }, 1000);
  }
}
