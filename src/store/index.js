// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './loadingSlice';
import snackbarReducer from './snackbarSlice';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    snackbar: snackbarReducer
  }
});

export default store;
