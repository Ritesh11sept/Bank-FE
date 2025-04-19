import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api'; 
import { adminApi } from "./adminApi";

// Create the store with middleware
export const store = configureStore({
  reducer: {
    // Add both API reducers to the store
    [api.reducerPath]: api.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(adminApi.middleware),
});

// Configure listeners for auto-refetching based on actions
setupListeners(store.dispatch);
