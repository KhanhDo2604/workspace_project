import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/DialogSlice';
import meetingReducer from './slices/MeetingSlice';
import sideBarReducer from './slices/SideBarSlice';
import calendarReducer from './slices/CalendarSlice';

const store = configureStore({
    reducer: {
        dialog: dialogReducer,
        meeting: meetingReducer,
        sideBar: sideBarReducer,
        calendar: calendarReducer,
    },
});

export default store;
