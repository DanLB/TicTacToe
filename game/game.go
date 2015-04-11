package game

// import "fmt"

type Game struct {
	Squares []uint8
	TurnId  uint32
	PlayerX uint32
	PlayerY uint32
	GameId  string
	Winner  uint32
}

type Info struct {
	GameId     string
	PlayerId   uint32
	OpponentId uint32
	PlayerX	   uint32
}

const BLANK = 0
const Y_INT = 2
const X_INT = 1

var winningCombos = [][]uint8{
	{0, 1, 2},
	{3, 4, 5},
	{6, 7, 8},
	{0, 3, 6},
	{1, 4, 7},
	{2, 5, 8},
	{0, 4, 8},
	{2, 4, 6},
}

func NewGame() Game {
	return Game{
		[]uint8{0, 0, 0, 0, 0, 0, 0, 0, 0},
		0,
		0,
		0,
		"",
		0,
	}
}

func (currentGame *Game) HandleTurn(currentTurn Turn) Results {
	if currentGame.TurnId != currentTurn.PlayerId {
		return Results{Error: "Not your turn."}
	}

	column := currentTurn.ClickX / currentTurn.SquareSize
	row := currentTurn.ClickY / currentTurn.SquareSize

	index := column + 3* row

	if currentGame.Squares[index] != 0 {
		return Results{Error: "Square already occupied."}
	}

	if currentTurn.PlayerId == currentGame.PlayerX {
		currentGame.Squares[index] = X_INT
	} else {
		currentGame.Squares[index] = Y_INT
	}

	if hasWon(currentGame.Squares) {
		currentGame.Winner = currentGame.TurnId
		updateStats(currentGame)
	}

	updateGame(currentGame)

	return Results{Index: index,
		Value: currentGame.Squares[index],
		Turn:   currentGame.TurnId,
		Winner: currentGame.Winner,
		Error:  "",
	}
}

func hasWon(squares []uint8) bool {
	for _, combo := range winningCombos {
		if squares[combo[0]] != BLANK &&
				squares[combo[0]] == squares[combo[1]] &&
				squares[combo[1]] == squares[combo[2]] {
			return true;
		}
	}
	return false
}

func updateGame(gameToUpdate *Game) {
	if gameToUpdate.Winner != 0 {
		gameToUpdate.TurnId = 0
	} else if gameToUpdate.TurnId == gameToUpdate.PlayerX {
		gameToUpdate.TurnId = gameToUpdate.PlayerY
	} else {
		gameToUpdate.TurnId = gameToUpdate.PlayerX
	}
}

/**
 * TODO Implement this method.
 * This will update the database with the results of the game.
 */
func updateStats(gameToUpdate *Game) {
	return
}
