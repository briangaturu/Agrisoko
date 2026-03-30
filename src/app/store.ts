import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import authReducer from "../features/auth/authSlice";
import { userApi } from "../features/api/userApi";
import { cropApi } from "../features/api/cropApi";
import { listingsApi } from "../features/api/listingsApi";
import { ordersApi } from "../features/api/ordersApi";
import { paymentsApi } from "../features/api/paymentsApi"; // ✅ add this

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [cropApi.reducerPath]: cropApi.reducer,
    [listingsApi.reducerPath]: listingsApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [paymentsApi.reducerPath]: paymentsApi.reducer, // ✅ add this
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      userApi.middleware,
      cropApi.middleware,
      listingsApi.middleware,
      ordersApi.middleware,
      paymentsApi.middleware, // ✅ add this
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;