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

import { generateFieldMap } from './action';

interface IGenerateMapPayload {
  size: IFieldSize,
  minesCount: number
}

const getCeilString = (ceil: IFieldElement) => `${ceil.y}_${ceil.x}`;

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
