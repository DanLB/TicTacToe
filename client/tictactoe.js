function TicGame() {
    this.player1 = 0;
    this.player2 = 0;
    //turn will either be the ID of player1 or player2
    this.turn = 0;
    this.squares = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.gameId = 0;
}

const BLANK = 0;
const XINT = 1;
const YINT = 2;

var ticGame = new TicGame();

var current = 0;

function init() {
    var height = screen.height;
    var width = screen.width;

    var size = width / 5;
    var squareSize = size / 3;

    var canvas = document.getElementById("tictactoe");

    canvas.width = squareSize * 3;
    canvas.height = squareSize * 3;

    drawBoard();
}

function handleClick() {
    if ()
    ticGame.squares[current++] = 2;
    drawBoard();
}

function drawBoard() {
    var canvas = document.getElementById("tictactoe");
    var ticContext = canvas.getContext("2d");

    canvas.width = canvas.width;

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