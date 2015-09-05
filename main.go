package main

import (
	"encoding/json"
	"github.com/DanLB/tictactoe/game"
	"io/ioutil"
	"net/http"
	"log"
	"github.com/nu7hatch/gouuid"
	"github.com/daaku/go.httpgzip"
)

//Map of Game ID to Game
var gameMap = make(map[string]game.Game)

var waitingGames = make(chan string, 100) //Stores the gameId

var nextPlayerId uint32 = 10001

func main() {
	initLogging()

	newGame := game.NewGame()
	newGame.GameId = generateGameId()
	newGame.PlayerX = 10000
	newGame.TurnId = newGame.PlayerX;

	gameMap[newGame.GameId] = newGame
	waitingGames <- newGame.GameId

	game.Log("Starting the server on port 80")

	http.Handle("/", httpgzip.NewHandler(http.FileServer(http.Dir("./static/"))))
	http.HandleFunc("/tictactoe", index)
	http.HandleFunc("/tictactoe/register", newRegistration)
	http.HandleFunc("/tictactoe/forfeit", forfeit)
	http.HandleFunc("/tictactoe/turn", turnReceived)
	http.ListenAndServe(":80", nil)
}

func initLogging() {
	err := game.Init()

	if err != nil {
		log.Fatal(err.Error)
	}
}

func generateGameId() string {
	u4, err := uuid.NewV4()
	if err != nil {
	    log.Println("error:", err.Error())
	    return ""
	}
	uuid := u4.String()
	game.Log("Generating game ID: " + uuid)
	return uuid
}

func index(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func forfeit(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		w.WriteHeader(400);
		results := game.Results{Error: "Game ID and Player ID is required."}
		jsonResults, err := json.Marshal(results)
		if err != nil {
			handleError(w, err.Error())
			return
		}
		w.Write(jsonResults)
		return
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		handleError(w, err.Error())
		return
	}

	defer r.Body.Close()

	var forfeiter game.Turn
	json.Unmarshal(body, &forfeiter)

	game.Log("Player " + string(forfeiter.PlayerId) + " forfeited.")

	delete(gameMap, forfeiter.GameId)
}

// func newGame(w http.ResponseWriter, r *http.Request) {
// 	//todo constructor to generate game.
// 	newGame := game.NewGame()
// 	newGame.GameId = generateGameId()
// 	//todo create getNextPlayerId()
// 	// newGame.PlayerX = nextPlayerId++;
// 	newGame.TurnId = newGame.PlayerX;

// 	gameMap[newGame.GameId] = newGame
// 	waitingGames <- newGame.GameId

// 	game.Log("New game, currently " + len(waitingGames) + " waiting games.")
// }

func newRegistration(w http.ResponseWriter, r *http.Request) {
	select {
	case gameId := <- waitingGames:
		gameToPlay := gameMap[gameId]
		gameToPlay.PlayerY = nextPlayerId
		gameMap[gameId] = gameToPlay
		jsonResults, err := json.Marshal(game.Info{
			GameId: gameToPlay.GameId,
			PlayerId: gameToPlay.PlayerY,
			OpponentId: gameToPlay.PlayerX,
			PlayerX: gameToPlay.PlayerX,
		})

		if err != nil {
			handleError(w, err.Error())
		} else {
			nextPlayerId++
			w.Write(jsonResults)
			return
		}
	default:
		newGame := game.NewGame()
		newGame.GameId = generateGameId()
		newGame.PlayerX = nextPlayerId
		nextPlayerId = nextPlayerId + 1
		newGame.TurnId = newGame.PlayerX;

		gameMap[newGame.GameId] = newGame
		waitingGames <- newGame.GameId
		newRegistration(w, r)
	}
}

func turnReceived(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		return
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		handleError(w, err.Error())
		return
	}

	defer r.Body.Close()

	var currentTurn game.Turn
	err = json.Unmarshal(body, &currentTurn)

	if err != nil {
		handleError(w, err.Error())
		return
	}

	currentGame, ok := gameMap[currentTurn.GameId]

	var results game.Results
	if ok == false {
		results = game.Results{Error: "Game does not exist"}
	} else {
		game.Log(currentTurn)
		results = currentGame.HandleTurn(currentTurn)
		if results.Winner > 0 {
			delete(gameMap, currentTurn.GameId)
		} else {
			gameMap[currentTurn.GameId] = currentGame
		}
	}

	jsonResults, err := json.Marshal(results)

	if err != nil {
		handleError(w, err.Error())
		return
	}

	w.Write(jsonResults)
}

func handleError(w http.ResponseWriter, err string) {
	http.Error(w, err, http.StatusInternalServerError)
}