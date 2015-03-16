var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Player = require('./player.js');

var players = [];
var db = {};

console.log("Socket server starting...");
server.listen(4000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/restart', function (req, res) {
  for (var i = 0; i < players.length; i++) {
    players[i].getSocket().disconnect();
  }
  players = [];
  latestSocket = undefined;
  oprogress = 0;
  res.send('Server restarted');
});

io.on('connection', function (socket) {
  console.log("Client connected " + socket.id);
  socket.on('user', function (data) {
    console.log(data);
    if (data == "null" || data == null) {
      data = "Guest";
      var count = 2;
      while (true) {
        if (findPlayerByName(data) == undefined) break;
        data += count;
        count++;
      }
    }
    console.log("Username received from " + socket.id + " " + data);
    var player;
    if (db[data] == undefined) {
      console.log("Player not found in db, creating new player...");
      player = new Player(socket.id, data, socket);
    } else {
      console.log("Player found in db, resuming player...");
      player = db[data];
      player.setId(socket.id);
      player.setSocket(socket);
    }
    players.push(player);
    printPlayersOnline();
    latestSocket = socket;
    // Check if last player is matched
    if (players.length > 1 && players[players.length-2].getOpponent() == undefined) {
      var playerOne = players[players.length-2];
      var playerTwo = players[players.length-1];
      playerOne.setOpponent(players[players.length-1].getName());
      playerTwo.setOpponent(playerOne.getName());
      console.log("Match found! " + playerTwo.getName() + " & " + playerOne.getName());
      playerTwo.getSocket().emit('start', { message : playerTwo.getOpponent() + " - " + playerTwo.getRating.toString()});
      playerOne.getSocket().emit('start', { message : playerOne.getOpponent() + " - " + playerOne.getRating.toString()});
    } else {
      waitForAI();
    }
  });
  socket.on('progress', function (data) {
    var player = findPlayer(socket.id);
    var opponent = findPlayerByName(player.getOpponent());
    if (opponent == undefined) return;
    console.log("Progress received from " + player.getName() + " : " + data + " sending it to " + opponent.getName());
    opponent.getSocket().emit('oprogress', { 'message' : data });
  });
  socket.on('win', function (data) {
    var player = findPlayer(socket.id);
    var opponent = findPlayerByName(player.getOpponent());
    console.log("Progress received from " + player.getName() + " : " + data + " sending it to " + opponent.getName());
    opponent.getSocket().emit('lose', { 'message' : data });
  });
  socket.on('disconnect', function (data) {
    var player = findPlayerBySocketId(socket.id);
    players.splice(players.indexOf(player), 1);
    console.log("Cient disconnected " + player.getName() + " " + socket.id);
  });
});

// Utilities

function printPlayersOnline() {
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    console.log(i + " "  + player.getId());
    console.log(player.getName());
    console.log(player.getOpponent());
  }
}

function findPlayer(id) {
  var player;
  for (var i = 0; i < players.length; i++) {
    if (players[i].getId() == id) {
      player = players[i];
    }
  }
  if (player == undefined) console.error("findPlayer() not found");
  return player;
}

function findPlayerByName(name) {
  var player;
  for (var i = 0; i < players.length; i++) {
    if (players[i].getName() == name) {
      player = players[i];
    }
  }
  if (player == undefined) console.error("findPlayerByName() not found");
  return player;
}

function findPlayerBySocketId(socketId) {
  var player;
  for (var i = 0; i < players.length; i++) {
    if (players[i].getId() == socketId) {
      player = players[i];
    }
  }
  if (player == undefined) console.error("findPlayerBySocketId() not found");
  return player;
}

// AI functions

var oprogress = 0;
var latestSocket = undefined;

function sendAIProgress() {
  if (!updatedOpAIName) {
    latestSocket.emit('start', { message : "Evil AI - Rank 12" });
  } else {
    oprogress++;
    latestSocket.emit('oprogress', { message : oprogress });
  }
}

function waitForAI() {
  setTimeout(function() {
    shouldTriggerAI();
  }, 25000);
}

function shouldTriggerAI() {
  console.log("Checking if AI is necessary...");
  if (players.length == 1 || players[players.length-1].getOpponent() == undefined) {
    console.log("Triggering AI...");
    setInterval(sendAIProgress, 1000);
  }
}