import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import {
  IMainStore,
  GameStatus,
} from './types';

import { IFieldSize } from '../field/types';

interface ISetFieldPayload {
  size: IFieldSize,
  minesCount: number
}

const initialState: IMainStore = {
  minesCount: 10,
  size: {x: 10, y: 10},
  gameStatus: GameStatus.MAIN_SCREEN
};

const mainSlicer = createSlice({
  name: 'main',
  initialState: initialState,
  reducers: {
    setStartOptions: {
      reducer(state, action: PayloadAction<ISetFieldPayload>) {
        const {minesCount, size} = action.payload;
        state.size.x = size.x;
        state.size.y = size.y;
        state.minesCount = minesCount;
      },
      prepare: (minesCount: number, size: IFieldSize) => ({
        payload: {
          size: size,
          minesCount: minesCount
        }
      })
    },
      
    setGameState: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    }
  }
});

export const {
  setGameState,
  setStartOptions,
} = mainSlicer.actions;
export default mainSlicer.reducer;
