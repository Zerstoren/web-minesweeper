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
  generateMap, 
  searchElementForOpen,
  getCeilString,
  isAllMinesFound
} from './action';

interface IOpenElementPayload {
  element: IFieldElement,
  size: IFieldSize,
}

const fieldAdapter = createEntityAdapter<IFieldCeil>({
  selectId: (ceil: IFieldCeil) => getCeilString(ceil)
});

const initialState: IFieldStore = fieldAdapter.getInitialState({
  entities: <IFieldList>{},
  allMinesFound: false,
  isMineOpen: false,
});

const fieldSlice = createSlice({
  name: 'field',
  initialState: initialState,
  reducers: {
    openElement: {
      reducer(state, action: PayloadAction<IOpenElementPayload>) {
        const {element, size} = action.payload;
        
        const ceil = state.entities[getCeilString(element)];

        ceil.isOpen = true;

        if (ceil.isMine) {
          state.isMineOpen = true;
        }

        if (ceil.numberMinesArround === 0) {
          searchElementForOpen(element, size, state.entities)
            .map((element) => {
              state.entities[getCeilString(element)].isOpen = true;
            });
        }

        state.allMinesFound = isAllMinesFound(state);
      },
      prepare: (element: IFieldElement, size: IFieldSize) => ({
        payload: {
          element: {
            x: element.x,
            y: element.y
          },
          size: size
        }
      }),
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateMap.fulfilled, (state, action) => {
        state.isMineOpen = false;
        state.allMinesFound = false;
        fieldAdapter.setAll(state, action.payload);
      })
  }
});

export const {
  openElement,
  flagElement,
} = fieldSlice.actions;
export default fieldSlice.reducer;
