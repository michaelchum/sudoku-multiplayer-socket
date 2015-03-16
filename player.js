var Player = function(id, name, socket) {
  var name = name,
  id = id,
  socket = socket,
  opponent = undefined,
  opponentId = undefined,
  grid = undefined,
  progress = 0
  rating = 100;

  var getName = function() {
    return name;
  };

  var getId = function() {
    return id;
  };

  var setId = function(newId) {
    id = newId;
  };

  var getOpponent = function() {
    return opponent;
  };

  var getOpponentId = function() {
    return opponentId;
  };

  var setOpponent = function(newOpponent) {
    opponent = newOpponent;
  };

  var setOpponentId = function(newOpponentId) {
  opponentId = newOpponentId;
  };

  var setGrid = function(newGrid) {
    grid = newGrid;
  };

  var getGrid = function() {
    return grid;
  };

  var setProgress = function(newProgress) {
    progress = newProgress;
  };

  var getProgress = function() {
    return progress;
  };

  var getSocket = function() {
    return socket;
  };

  var setSocket = function(newSocket) {
    socket = newSocket;
  };

  var getRating = function() {
    return rating;
  };

  var incRating = function() {
    rating += 20;
    return rating;
  };

  var decRating = function() {
    rating -= 20;
    return rating;
  };

  return {
    getName : getName,
    getOpponent : getOpponent,
    setOpponent : setOpponent,
    setGrid : setGrid,
    getGrid : getGrid,
    setProgress : setProgress,
    getProgress : getProgress,
    getId : getId,
    setId : setId,
    getSocket : getSocket,
    setSocket : setSocket,
    getOpponentId : getOpponentId,
    setOpponentId : setOpponentId,
    getRating : getRating,
    incRating : incRating,
    decRating : decRating
  }
};

module.exports = Player;
