interface ImportMeta {
    readonly env: {
        VITE_HOST: string;
        VITE_APP_CLIENT_ID: string;
        VITE_APP_CLIENT_SECRET: string;
    };
}

declare module "redux-persist-indexeddb-storage";
declare namespace globalThis {
    interface Window {
        uid: string;
    }
}