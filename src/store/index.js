import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/index';

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
    },
});

export default store;
