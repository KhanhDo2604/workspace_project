import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import dialogReducer from './slices/DialogSlice';
import meetingReducer from './slices/MeetingSlice';
import sideBarReducer from './slices/SideBarSlice';
import calendarReducer from './slices/CalendarSlice';
import authReducer from './slices/AuthSlice';

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
        meeting: meetingReducer,
        sideBar: sideBarReducer,
        calendar: calendarReducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
