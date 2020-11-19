export type {
  IMainStore
}

export {
  GameStatus
}

interface IMainStore {
  fieldSizeX: number,
  fieldSizeY: number,
  minesCount: number,
  gameStatus: GameStatus
}

enum GameStatus {
  MAIN_SCREEN,
  GAME_BEFORE_START,
  GAME_IN_PROCESS,
  WIN_SCREEN,
  LOOSE_SCREEN
}