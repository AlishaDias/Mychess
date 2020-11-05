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
    
});

app.set('view engine',"ejs");

app.get(['/','/:id','/default.html'],function(req,res){
    res.render('default.ejs',{Player:req.query});
});

http.listen(port,function(){
    console.log('listening on *: ' + port);
});