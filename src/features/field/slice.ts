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
  IOpenCellPayload
} from './types';

import { 
  generateMap, 
  getCeilString,
  isAllMinesFound,
  openCeil
} from './action';

const fieldAdapter = createEntityAdapter<IFieldCeil>({
  selectId: (ceil: IFieldCeil) => getCeilString(ceil)
});

const initialState: IFieldStore = fieldAdapter.getInitialState({
  entities: {} as IFieldList,
  allMinesFound: false,
  isMineOpen: false,
  minesLeft: 0,
});

const fieldSlice = createSlice({
  name: 'field',
  initialState: initialState,
  reducers: {
    flagElement: {
      reducer(state, action: PayloadAction<IFieldElement>) {
        const ceil = state.entities[getCeilString(action.payload)];
        ceil.isFlagged = !ceil.isFlagged;
        state.minesLeft += ceil.isFlagged ? -1 : 1;

        if (isAllMinesFound(state.entities)) {
          state.allMinesFound = true;
        }
      },
      prepare: (ceil: IFieldElement) => ({
        payload: {
          x: ceil.x,
          y: ceil.y
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateMap.fulfilled, (state, action) => {
        state.isMineOpen = false;
        state.allMinesFound = false;
        state.minesLeft = action.payload.filter((ceil: IFieldCeil) => ceil.isMine).length;
        fieldAdapter.setAll(state, action.payload);
      })
      .addCase(openCeil.fulfilled, (state, action: PayloadAction<IOpenCellPayload>) => {
        const {targetElement, foundToOpen, isMine} = action.payload;

        state.entities[getCeilString(targetElement)].isOpen = true;

        if (isMine) {
          state.isMineOpen = true;
          return;
        }

        foundToOpen.forEach((element) => {
          state.entities[getCeilString(element)].isOpen = true;
        });


        if (isAllMinesFound(state.entities)) {
          state.allMinesFound = true;
          return;
        }
      })
  }
});

export const {
  flagElement,
} = fieldSlice.actions;
export default fieldSlice.reducer;
