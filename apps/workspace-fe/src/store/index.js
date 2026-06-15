import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import dialogReducer from './slices/DialogSlice';
import meetingReducer from './slices/MeetingSlice';
import sideBarReducer from './slices/SideBarSlice';
import calendarReducer from './slices/CalendarSlice';
import authReducer from './slices/AuthSlice';
import projectReducer from './slices/ProjectSlice';
import userReducer from './slices/UserSlice';
import { combineReducers } from 'redux';

const persistConfig = {
    key: 'auth',
    storage,
    whitelist: ['auth', 'project', 'sideBar'],
    blacklist: ['dialog', 'meeting', 'calendar'],
};

const rootReducer = combineReducers({
    dialog: dialogReducer,
    meeting: meetingReducer,
    sideBar: sideBarReducer,
    calendar: calendarReducer,
    auth: authReducer,
    project: projectReducer,
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
