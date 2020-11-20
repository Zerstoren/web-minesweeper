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
  MAIN_SCREEN = 'main_screen',
  GAME_GENERATE_MAP = 'generate_map',
  GAME_BEFORE_START = 'before_start',
  GAME_IN_PROCESS = 'in_process',
  WIN_SCREEN = 'win',
  LOOSE_SCREEN = 'loose'
}