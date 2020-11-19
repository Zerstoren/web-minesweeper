import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import {
  IMainStore,
  GameStatus,
} from './types';

interface ISetFieldPayload {
  sizeX: number, 
  sizeY: number, 
  minesCount: number
}

const initialState: IMainStore = {
  fieldSizeX: 10,
  fieldSizeY: 10,
  minesCount: 10,
  gameStatus: GameStatus.MAIN_SCREEN
};

const mainSlicer = createSlice({
  name: 'main',
  initialState: initialState,
  reducers: {
    setStartOptions: {
      reducer(state, action: PayloadAction<ISetFieldPayload>) {
        const {minesCount, sizeX, sizeY} = action.payload;
        state.fieldSizeX = sizeX;
        state.fieldSizeY = sizeY;
        state.minesCount = minesCount;
      },
      prepare: (sizeX: number, sizeY: number, minesCount: number) => ({
        payload: {
          sizeX: sizeX,
          sizeY: sizeY,
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
