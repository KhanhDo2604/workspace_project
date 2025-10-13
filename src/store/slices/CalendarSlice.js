import { createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';
import { MODES } from '../../constants/common';

const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        monthIndex: dayjs().month().valueOf(),
        year: dayjs().year().valueOf(),
        smallCalendarMonth: null,
        daySelected: dayjs().valueOf(),
        showEventModal: false,
        selectedEvent: null,
        labels: [],
        viewMode: MODES[2],
    },
    reducers: {
        setMonthYear: (state, action) => {
            state.monthIndex = action.payload.month;
            state.year = action.payload.year;
        },
        setDaySelected: (state, action) => {
            state.daySelected = action.payload;
        },
        setShowEventModal: (state, action) => {
            state.showEventModal = action.payload;
            if (!action.payload) {
                state.selectedEvent = null;
            }
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload;
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
    },
});

export const calendarActions = calendarSlice.actions;

export default calendarSlice.reducer;
