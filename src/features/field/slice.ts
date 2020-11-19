import {
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import { 
  IFieldCeil,
  IFieldElement, 
  IFieldList, 
  IFieldStore, 
  IFieldSize
} from './types';

import { 
  generateFieldMap, 
  searchElementForOpen,
  getCeilString,
  noMinesLeft
} from './action';

import store from '../store';
import { setGameState } from '../main/slicer';
import { GameStatus } from '../main/types';

interface IGenerateMapPayload {
  size: IFieldSize,
  minesCount: number
}

interface IOpenElementPayload {
  element: IFieldElement,
  size: IFieldSize,
}

const fieldAdapter = createEntityAdapter<IFieldCeil>({
  selectId: (ceil: IFieldCeil) => getCeilString(ceil)
});

const initialState: IFieldStore = fieldAdapter.getInitialState({
  entities: <IFieldList>{}
});

const fieldSlice = createSlice({
  name: 'field',
  initialState: initialState,
  reducers: {
    generateMap: {
      reducer(state, action: PayloadAction<IGenerateMapPayload>) {
        const {minesCount, size} = action.payload;
        fieldAdapter.setAll(state, generateFieldMap(minesCount, size));
      },
      prepare: (minesCount: number, size: IFieldSize) => ({
        payload: {
          size: size,
          minesCount: minesCount
        }
      })
    },

    openElement: {
      reducer(state, action: PayloadAction<IOpenElementPayload>) {
        const {element, size} = action.payload;
        
        const ceil = state.entities[getCeilString(element)];

        ceil.isOpen = true;

        if (ceil.isMine) {
          //TODO костыль, переделать
          setTimeout(() => {
            store.dispatch(setGameState(GameStatus.LOOSE_SCREEN));
          });
        }

        if (ceil.numberMinesArround === 0) {
          searchElementForOpen(element, size, state.entities)
            .map((element) => {
              state.entities[getCeilString(element)].isOpen = true;
            });
        }

        if (noMinesLeft()) {
          //TODO костыль, переделать
          setTimeout(() => {
            store.dispatch(setGameState(GameStatus.WIN_SCREEN));
          });
        }


      },
      prepare: (element: IFieldElement, size: IFieldSize) => ({
        payload: {
          element: {
            x: element.x,
            y: element.y
          },
          size: size
        }
      })
    },

    flagElement: {
      reducer(state, action: PayloadAction<IFieldElement>) {
        state.entities[getCeilString(action.payload)].isFlagged = !state.entities[getCeilString(action.payload)].isFlagged;
      },
      prepare: (ceil: IFieldElement) => ({
        payload: {
          x: ceil.x,
          y: ceil.y
        }
      })
    }
  }
});

export const {
  generateMap,
  openElement,
  flagElement,
} = fieldSlice.actions;
export default fieldSlice.reducer;
