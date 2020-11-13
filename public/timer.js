var myinterval=-1;
var myinterval2=-1;
var url_string=(window.location.href).toLowerCase();
var url = new URL(url_string);

var countdownEl=document.getElementById("countdown")
var countdownEl2=document.getElementById("countdown2")
var startMinutes=url.searchParams.get("time");
var startMinutes2=url.searchParams.get("opponenttime");
var output=document.getElementById("clockdiv");
var output2=document.getElementById("clockdiv2");
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
      socket.emit("time",{
          minutes:minutes,
          seconds:seconds
      });  
    },1000);
    if(time<-1){
      alert("Time Over");
  }
  }
  function pause(){
    clearInterval(myinterval);
      myinterval=-1; 
  }
  
function resume(){
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
}

    start.addEventListener('click',function(event){  
        clearInterval(myinterval);
      myinterval=-1;
      socket.emit("time",{
        minutes:minutes,
        seconds:seconds
      }); 
    })
    test.addEventListener('click',function(event){
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
              if(time<-1){
                alert("Time Over");
            }
              socket.emit("time",{
                minutes:minutes,
                seconds:seconds
              });
            },1000);
        }
    })
    
    
function countdown2(){       
    clearInterval(myinterval2);       //for timer 2
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
    if(opponenttime<-1){
          alert("Time Over");
      }
    socket.emit("time2",{
      mins:mins,
      sec:sec
    });
  },1000)
 
}
    
function pause2(){
    clearInterval(myinterval2);
    myinterval2=-1;
}

function resume2(){
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
          if(opponenttime<-1){
              alert("Time Over");
          }
        },1000);
      }
}


socket.on('time',function(msg){
    output2.innerHTML=msg.minutes+ ":" +msg.seconds;
  });
  socket.on('time2',function(msg){
    output.innerHTML=msg.mins+ ":" +msg.sec;
  });
  