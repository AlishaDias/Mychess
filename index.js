var express = require("express");
var app = express();
app.use(express.static("public"));
var http = require("http").Server(app);
var port = process.env.PORT || 3000;

//socket server setup
var io = require("socket.io")(http);

// io.on("connection", function (socket) {
//   console.log("new connection");
//   //this is called whenthe socket calls socket.emit('move')
//   socket.on("move", function (id, msg) {
//     socket.to(id).emit("move", msg);
//   });
// });

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ gameroom }) => {
    // const user = userJoin(socket.id, username, gameroom);
    socket.join(gameroom);
    console.log(gameroom + ": Connected");
  });
  // Listen for moveMessage
  socket.on("move", ({ gameroom, msg }) => {
    //   io.to(user.room).emit("move", msg);
    console.log("Message Received for" + gameroom + " : Message = " + msg);
    socket.broadcast.to(gameroom).emit("move", { msg: msg });
    // socket.emit("move", msg);
    // io.in(gameroom).emit("move", msg);
  });
});

app.set("view engine", "ejs");

app.get(["/", "/:id", "/default.html"], function (req, res) {
  res.render("default.ejs", { Player: req.query });
});

http.listen(port, function () {
  console.log("listening on *: " + port);
});
//http://127.0.0.1:3000/?user=Player1&opponent=Player2&orientation=white&boardgame=[unique]&Time=10&opponentTime=10
//http://127.0.0.1:3000/?user=Player2&opponent=Player1&orientation=black&boardgame=[unique]&Time=10&opponentTime=10
