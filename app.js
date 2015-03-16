var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Player = require('./player.js');

var players = [];

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
    players.push(new Player(socket.id, data, socket));
    printPlayers();
    latestSocket = socket;
    // Check if last player is matched
    if (players.length > 1 && players[players.length-2].getOpponent() == undefined) {
      players[players.length-2].setOpponent(players[players.length-1].getName());
      players[players.length-1].setOpponent(players[players.length-2].getName());
      console.log("Match found! " + players[players.length-1].getName() + " & " + players[players.length-2].getName());
      players[players.length-1].getSocket().emit('start', { message : players[players.length-1].getOpponent() + " - No ranking" });
      players[players.length-2].getSocket().emit('start', { message : players[players.length-2].getOpponent() + " - No ranking" });
    } else {
      //waitForAI();
    }
  });
  socket.on('progress', function (data) {
    if (updatedOpAIName) return;
    var player = findPlayer(socket.id);
    var opponent = findPlayerByName(player.getOpponent());
    console.log("Progress received from " + player.getName() + " : " + data + " sending it to " + opponent.getName());
    opponent.getSocket().emit('oprogress', { 'message' : data });
  });
  socket.on('disconnect', function (data) {
    console.log("Cient disconnected " + socket.id);
  });
});

function printPlayers() {
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
  return player;
}

function findPlayerByName(name) {
  var player;
  for (var i = 0; i < players.length; i++) {
    if (players[i].getName() == name) {
      player = players[i];
    }
  }
  return player;
}

var oprogress = 0;
var latestSocket = undefined;
var updatedOpAIName = false;

function sendAIProgress() {
  if (!updatedOpAIName) {
    latestSocket.emit('start', { message : "Evil AI - Rank 12" });
    updatedOpAIName = true;
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
  if (players[players.length-2].getOpponent() == undefined) {
    console.log("Triggering AI...");
    setInterval(sendAIProgress, 1000);
  }
}
