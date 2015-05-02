function TicGame() {
    this.player1 = 0;
    this.player2 = 0;
    this.turn = 0;
    this.squares = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.gameId = "";
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

function register() {
    if (ticGame.gameId != "") {
        var warning = ticGame.turn != 0 ? " This will forfeit your current game." : "";
        var newGame = confirm("Do you want to start a new game?" + warning);
        if (!newGame) {
            return;
        }
        var turn = new Turn(0, 0, 0, ticGame.turn, ticGame.gameId);
        ajaxRequest("/tictactoe/forfeit", turn);
    }

    ajaxRequest("/tictactoe/register", "", registered);
}

function registered(registration) {
    if (registration === 409) {
        displayMessage("Already registered");
        return;
    }

    ticGame.gameId = registration.GameId;
    ticGame.player1 = registration.PlayerId;
    ticGame.player2 = registration.OpponentId;
    ticGame.turn = registration.PlayerX;

    displayMessage(ticGame.gameId);
}

function displayMessage(message) {
    document.getElementById("test").innerHTML = message;
}

function handleClick(event) {
    var canvas = document.getElementById("tictactoe");
    var bb = canvas.getBoundingClientRect();

    var turn = new Turn(
        (event.clientX - bb.left) * (canvas.width / bb.width),
        (event.clientY - bb.top) * (canvas.height / bb.height),
        canvas.width / 3,
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
    if (results.winner > 0) {
        displayMessage(
            results.winner == ticGame.player1 ? "Congratulations, You win!" : "You lost, better luck next time!"
        );
    }
    var index = results.index;
    ticGame.squares[index] = results.value;
    ticGame.turn = results.turn;

    drawBoard();
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
            var symbol = XINT === squares[index] ? "X" : "Y";
            x = j * squareSize + sqHalf;
            y = i / 3 * squareSize + squareSize * 0.6;
            ticContext.fillText(symbol, x, y, squareSize);
        }
    }
}