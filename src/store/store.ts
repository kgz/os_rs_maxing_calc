import type { DefaultRootState, TypedUseSelectorHook } from "react-redux";
import {
    combineReducers,
    configureStore,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import type { PersistConfig } from "redux-persist";
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
import storage from "redux-persist-indexeddb-storage";

import { v4 } from "uuid";
import { characterReducer } from "./slices/characterSlice";
import { skillsReducer } from "./slices/skillsSlice";
import itemsReducer from './slices/itemsSlice';
import { fetchItemMapping } from './thunks/items/fetchItemMapping';
import getStoredState from "redux-persist/es/getStoredState";

const persistConfig: PersistConfig<DefaultRootState> = {
    key: "root",
    storage: storage("BAWP"),
};

const rootReducer = combineReducers({
    characterReducer,
    skillsReducer,
    items: itemsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Fetch item mapping data on application startup
store.dispatch(fetchItemMapping());

export const persistor = persistStore(store);

window.uid = v4();
const bc = new BroadcastChannel("test_channel");
let locked = false;

bc.onmessage = (ev) => {
    const { uuid } = ev.data;
    if (uuid === window.uid) {
        locked = false;
        return;
    }

    // rehydrate store from indexeddb
    void getStoredState(persistConfig).then((state) => {
        locked = true;
        store.dispatch({
            type: "persist/REHYDRATE",
            key: "root",
            payload: state,
        });
    });
};

store.subscribe(() => {
    if (locked) {
        locked = false;
        return;
    }
    const bc = new BroadcastChannel("test_channel");
    setTimeout(() => {
        bc.postMessage({ uuid: window.uid });
    }, 200);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type TRootState = ReturnType<typeof rootReducer>;

declare module "react-redux" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultRootState extends TRootState {}
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;