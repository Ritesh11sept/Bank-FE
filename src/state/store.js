import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api'; // This assumes your API is defined in this file

// Create the store with middleware
export const store = configureStore({
  reducer: {
    // Add the API reducer to the store
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Configure listeners for auto-refetching based on actions
setupListeners(store.dispatch);
