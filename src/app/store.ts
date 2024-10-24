import { configureStore } from '@reduxjs/toolkit';
import itemReducer from '../Features/itemSlice';

// Create the store
const store = configureStore({
  reducer: {
    items: itemReducer,
  },
});

// Export types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
