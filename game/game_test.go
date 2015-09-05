package game

import "testing"

func TestHasWon(t *testing.T) {
    squares := []uint8{1, 0, 0, 0, 1, 0, 0, 0, 1}

    won := hasWon(squares)

    if won == false {
        t.Error("Won was false!")
    }
}

func TestHasWonYHoriz(t *testing.T) {
    squares := []uint8{0, 0, 0, 2, 2, 2, 1, 0, 0}

    won := hasWon(squares)

    if won == false {
        t.Error("Won was false!")
    }
}