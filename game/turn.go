package game

type Turn struct {
	ClickX     uint16 `json:"clickX"`
	ClickY     uint16 `json:"clickY"`
	SquareSize uint16 `json:"squareSize"`
	PlayerId   uint32 `json:"playerId"`
	GameId     string `json:"gameId"`
}

type Results struct {
	Index uint16 `json:"index"`
    Value uint8 `json:"value"`
	Turn    uint32 `json:"turn"`
	Winner  uint32 `json:"winner"`
	Error   string `json:"err"`
}
