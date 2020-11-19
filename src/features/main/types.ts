import { IFieldSize } from "../field/types"

export type {
  IMainStore
}

export {
  GameStatus
}

interface IMainStore {
  size: IFieldSize,
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