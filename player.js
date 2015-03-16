var Player = function(id, name, socket) {
    var name = name,
        id = id,
	socket = socket,
        opponent = undefined,
	opponentId = undefined,
        grid = undefined,
        progress = 0;

    var getName = function() {
        return name;
    };

    var getId = function () {
        return id;
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

    return {
        getName : getName,
        getOpponent : getOpponent,
        setOpponent : setOpponent,
        setGrid : setGrid,
        getGrid : getGrid,
        setProgress : setProgress,
        getProgress : getProgress,
        getId : getId,
	getSocket : getSocket,
	getOpponentId : getOpponentId,
	setOpponentId : setOpponentId
    }
};

module.exports = Player;
