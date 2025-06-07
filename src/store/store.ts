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
import getStoredState from "redux-persist/es/getStoredState";
import { characterReducer } from "./slices/characterSlice";
// import testMiddleware from "./middleware/testMiddleware";

const reducer = combineReducers({
	characterReducer
});

const persistConfig: PersistConfig<DefaultRootState> = {
    key: "root",
    storage: storage("BAWP"),
};
const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
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
        })
            // .concat(thunk)
            // .concat(testMiddleware),
});

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

    console.log({ uuid, uid: window.uid });
    // rehydrate store from indexeddb
    void getStoredState(persistConfig).then((state) => {
        locked = true;
        store.dispatch({
            type: "persist/REHYDRATE",
            key: "root",
            payload: state,
        });
        console.log({ state });
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

export type StoreType = typeof store;

export type IAppDispatch = StoreType["dispatch"];

export type TRootState = ReturnType<typeof reducer>;

declare module "react-redux" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DefaultRootState extends TRootState {}
}
export const useAppDispatch = () => useDispatch<IAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<DefaultRootState> =
    useSelector;
export default store;