import {configureStore} from '@reduxjs/toolkit';

import mainReducer from './main/slicer';
import fieldReducer from './field/slice';


const store = configureStore({
  reducer: {
    main: mainReducer,
    field: fieldReducer,
  },
});

export type IRootStore = ReturnType<typeof store.getState>;
export default store;
