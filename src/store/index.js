import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/DialogSlice';
import meetingReducer from './slices/MeetingSlice';
import sideBarReducer from './slices/SideBarSlice';

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
        meeting: meetingReducer,
        sideBar: sideBarReducer,
    },
});

export default store;
