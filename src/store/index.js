import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/DialogSlice';
import meetingReducer from './slices/MeetingSlice';

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
        meeting: meetingReducer,
    },
});

export default store;
