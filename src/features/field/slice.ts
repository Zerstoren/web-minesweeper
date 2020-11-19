import {
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import { 
  IFieldCeil,
  IFieldElement, 
  IFieldList, 
  IFieldStore 
} from './types';

import { generateFieldMap } from './action';

interface IGenerateMapPayload {
  sizeX: number,
  sizeY: number,
  minesCount: number
}

const getCeilString = (ceil: IFieldElement) => `${ceil.y}_${ceil.x}`;

const fieldAdapter = createEntityAdapter<IFieldElement>({
  selectId: (ceil: IFieldElement) => getCeilString(ceil)
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
        const {minesCount, sizeX, sizeY} = action.payload;
        generateFieldMap(sizeX, sizeY, minesCount);
      },
      prepare: (sizeX: number, sizeY: number, minesCount: number) => ({
        payload: {
          sizeX: sizeX,
          sizeY: sizeY,
          minesCount: minesCount
        }
      })
    },

    openElement: {
      reducer(state, action: PayloadAction<IFieldElement>) {
        
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
  openElement
} = fieldSlice.actions;
export default fieldSlice.reducer;
