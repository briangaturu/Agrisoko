import { configureStore, combineReducers, createSlice } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

/* ------------------------------------------------------------------ */
/* Dummy reducer (required) */
/* ------------------------------------------------------------------ */

const appSlice = createSlice({
  name: "app",
  initialState: {
    initialized: true,
  },
  reducers: {},
});

/* ------------------------------------------------------------------ */
/* Root reducer */
/* ------------------------------------------------------------------ */

const rootReducer = combineReducers({
  app: appSlice.reducer, // ✅ REQUIRED
});

/* ------------------------------------------------------------------ */
/* Persist config */
/* ------------------------------------------------------------------ */

const persistConfig = {
  key: "root",
  storage,
};

/* ------------------------------------------------------------------ */
/* Persisted reducer */
/* ------------------------------------------------------------------ */

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ------------------------------------------------------------------ */
/* Store */
/* ------------------------------------------------------------------ */

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

/* ------------------------------------------------------------------ */
/* Persistor */
/* ------------------------------------------------------------------ */

export const persister = persistStore(store);

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;