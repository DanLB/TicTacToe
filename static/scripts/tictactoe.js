function TicGame() {
    this.player1 = 0;
    this.player2 = 0;
    this.turn = 0;
    this.squares = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.gameId = "";
    this.playerX = 0;
}

function Turn(clickX, clickY, squareSize, playerId, gameId) {
    this.clickX = clickX;
    this.clickY = clickY;
    this.squareSize = squareSize;
    this.playerId = playerId;
    this.gameId = gameId;
}

function Results() {
    this.index = 0;
    this.value = 0;
    this.turn = 0;
    this.winner = 0;
    this.err = "";
}

const BLANK = 0;
const XINT = 1;
const YINT = 2;

var ticGame = new TicGame();

function init() {
    drawBoard();
}

function newGame() {
    if (ticGame.turn > 0) {
        if (!forfeit(" Forfeit and start a new game?")) {
            return;
        }
    }

    ajaxRequest("/tictactoe/register", "", registered);
}

function forfeit(message) {
    if (!message) {
        message = "";
    }
    var result = false;
    if (ticGame.gameId != "" && ticGame.turn > 0) {
        var newGame = confirm("This will forfeit your current game." + message);
        if (!newGame) {
            return false;
        }
        var turn = new Turn(0, 0, 0, ticGame.turn, ticGame.gameId);
        ajaxRequest("/tictactoe/forfeit", turn);
        displayMessage("Game forfeited.");
        result = true;
    } else {
        displayMessage("No game currently started.");
    }
    ticGame = new TicGame();
    drawBoard();
    return result;
}

function registered(registration) {
    if (registration === 409) {
        displayMessage("Already registered");
        return;
    }

    ticGame = new TicGame();
    ticGame.gameId = registration.GameId;
    ticGame.player1 = registration.PlayerId;
    ticGame.player2 = registration.OpponentId;
    ticGame.turn = registration.PlayerX;
    ticGame.playerX = registration.PlayerX;

    drawBoard();

    displayMessage(ticGame.gameId);
}

function displayMessage(message, append) {
    var messageDiv = document.getElementById("message");

    if (append) {
        messageDiv.innerHTML = messageDiv.innerHTML + message;
    } else {
        messageDiv.innerHTML = message;
    }
}

function handleClick(event) {
    if (ticGame.gameId == "") {
        ajaxRequest("/tictactoe/register", "", function(registration) {
            registered(registration);
            handleClick(event);
        });
        return;
    }

    var canvas = document.getElementById("tictactoe");
    var bb = canvas.getBoundingClientRect();

    var turn = new Turn(
        parseInt((event.clientX - bb.left) * (canvas.width / bb.width)),
        parseInt((event.clientY - bb.top) * (canvas.height / bb.height)),
        parseInt(canvas.width / 3),
        ticGame.turn,
        ticGame.gameId
    );

    ajaxRequest("/tictactoe/turn", turn, turnResults);
}

function turnResults(results) {
    if (results.err.length > 0) {
        displayMessage(results.err);
        return;
    }

    var index = results.index;
    ticGame.squares[index] = results.value;
    ticGame.turn = results.turn;

    drawBoard();

    if (results.winner > 0) {
        displayMessage(
            // results.winner == ticGame.player1 ? "Congratulations, You win!" : "You lost, better luck next time!"
            results.winner == ticGame.playerX ? "X wins!" : "O wins!"
        );
        ticGame = new TicGame();
    }
}

function drawBoard() {
    var canvas = document.getElementById("tictactoe");
    var ticContext = canvas.getContext("2d");

    canvas.height = canvas.width;
    canvas.width = canvas.width;
    canvas.style.height = canvas.width;
    canvas.style.width = canvas.width;

    var squareSize = canvas.width / 3;

    ticContext.lineWidth = 2;
    ticContext.moveTo(squareSize, 0);
    ticContext.lineTo(squareSize, squareSize * 3);
    ticContext.moveTo(squareSize * 2, 0);
    ticContext.lineTo(squareSize * 2, squareSize * 3);
    ticContext.moveTo(0, squareSize);
    ticContext.lineTo(squareSize * 3, squareSize);
    ticContext.moveTo(0, squareSize * 2);
    ticContext.lineTo(squareSize * 3, squareSize * 2);
    ticContext.stroke();

    var boundBox = canvas.getBoundingClientRect();
    var canvasX = boundBox.left;
    var canvasY = boundBox.top;
    var sqHalf = squareSize / 2;

    var x, y;

    var squares = ticGame.squares;

    ticContext.textAlign = "center";
    ticContext.textBaseline = "middle";
    ticContext.font = squareSize - 10 + "px sans-serif";
    
    for (var i = 0; i < 7; i += 3) {
        for (var j = 0; j < 3; j++) {
            var index = i + j;
            if (squares[index] === BLANK) { continue; }
            var symbol = XINT === squares[index] ? "X" : "O";
            x = j * squareSize + sqHalf;
            y = i / 3 * squareSize + squareSize * 0.6;
            ticContext.fillText(symbol, x, y, squareSize);
        }
    }
}