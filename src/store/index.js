import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/DialogSlice';
import meetingReducer from './slices/MeetingSlice';
import sideBarReducer from './slices/SideBarSlice';
import calendarReducer from './slices/CalendarSlice';
import authReducer from './slices/AuthSlice';

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
        meeting: meetingReducer,
        sideBar: sideBarReducer,
        calendar: calendarReducer,
        auth: authReducer,
    },
});

export default store;
