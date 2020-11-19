import {configureStore} from '@reduxjs/toolkit';

import mainReducer from './main/slicer';
import {IMainStore} from './main/types';

import fieldReducer from './field/slice';
import {IFieldStore} from './field/types';

interface IRootStore {
  main: IMainStore
  field: IFieldStore
}

const store = configureStore({
  reducer: {
    main: mainReducer,
    field: fieldReducer,
  }
});

export default store;
export type {
    IRootStore
}