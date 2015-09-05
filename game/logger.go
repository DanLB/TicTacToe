package game;

import (
    "log"
    "os"
)

var logger *log.Logger

func Init() error {
    logFile, err := os.Create("tictactoe.log")

    if err != nil {
        return err
    }

    logger = log.New(logFile, "", log.Ldate | log.Ltime)

    return nil
}

func Log(message ...interface{}) {
    logger.Println(message)
}