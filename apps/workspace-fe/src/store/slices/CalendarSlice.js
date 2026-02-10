import { createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';
import { MODES } from '../../constants/common';

/**
 * The calendarSlice controls month/year navigation, selected dates,
 * view modes, and event modal visibility within the calendar module.
 */
const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        monthIndex: dayjs().month().valueOf() /** The current visible month index (0–11). */,
        year: dayjs().year().valueOf() /** The current visible year. */,
        smallCalendarMonth: null /** The month displayed in the small calendar view. */,
        daySelected: dayjs().valueOf() /** The currently selected day. */,
        showEventModal: false /** Indicates whether the event modal is open. */,
        selectedEvent: null /** The currently selected event. */,
        labels: [],
        viewMode: MODES[2],
    },
    reducers: {
        /** Updates both the month and year displayed in the calendar. */
        setMonthYear: (state, action) => {
            state.monthIndex = action.payload.month;
            state.year = action.payload.year;
        },
        /** Updates the currently selected date. */
        setDaySelected: (state, action) => {
            state.daySelected = action.payload;
        },
        /** Controls the visibility of the event modal. */
        setShowEventModal: (state, action) => {
            state.showEventModal = action.payload;
            if (!action.payload) {
                state.selectedEvent = null;
            }
        },
        /** Stores or clears the currently selected event. */
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload;
        },
        /** Changes the calendar’s view mode (e.g., Month → Week). */
        setViewMode: (state, action) => {
            state.viewMode = action.payload;
        },
    },
});

export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;
