var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

//socket server setup
var io = require('socket.io')(http);

io.on('connection',function(socket) {
    console.log('new connection');
    
    //this is called whenthe socket calls socket.emit('move')
    socket.on('move',function(msg){
        socket.broadcast.emit("move",msg);
    });
    socket.on('time',function(msg){
        socket.broadcast.emit('time',msg);
    });
});

app.set('view engine',"ejs");

app.get(['/','/:id','/default.html'],function(req,res){
    res.render('default.ejs',{Player:req.query});
});

http.listen(port,function(){
    console.log('listening on *: ' + port);
});
//http://127.0.0.1:3000/?user=Player1&opponent=Player2&orientation=white&gameid=[unique]&Time=10&opponentTime=10