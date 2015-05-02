package main

import (
	"encoding/json"
	"github.com/DanLB/tictactoe/game"
	"io/ioutil"
	"net/http"
	"log"
	"github.com/nu7hatch/gouuid"
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

	http.Handle("/", http.FileServer(http.Dir("./static/")))
	http.HandleFunc("/tictactoe", index)
	http.HandleFunc("/tictactoe/register", newRegistration)
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
		w.WriteHeader(409)
	}
}

func turnReceived(w http.ResponseWriter, r *http.Request) {
	if r.Body == nil {
		return
	}

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {
		handleError(w, err.Error())
	}

	defer r.Body.Close()

	var currentTurn game.Turn
	json.Unmarshal(body, &currentTurn)

	//todo validate values > 0, etc.

	currentGame, ok := gameMap[currentTurn.GameId]

	var results game.Results
	if ok == false {
		results = game.Results{Error: "Game does not exist"}
	} else {
		results = currentGame.HandleTurn(currentTurn)
		//Update map
		gameMap[currentTurn.GameId] = currentGame
	}

	jsonResults, err := json.Marshal(results)

	if err != nil {
		handleError(w, err.Error())
	}

	w.Write(jsonResults)
}

func handleError(w http.ResponseWriter, err string) {
	http.Error(w, err, http.StatusInternalServerError)
}