import { createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';

const tasks = [
    {
        id: 1,
        title: 'Monthly catch-up Monthly catch-up',
        date: 1754252100,
        link: 'https://zoom.us/1',
        color: 'bg-green-100',
    },
    {
        id: 2,
        title: '1:1 with Heather',
        date: 1754254800,
        link: 'https://zoom.us/1',
        color: 'bg-blue-100',
    },
    {
        id: 4,
        title: '1:1 with Heather',
        date: 1754258400,
        link: 'https://zoom.us/1',
        color: 'bg-blue-100',
    },
    {
        id: 3,
        title: 'EOD Demo Sync',
        date: 1755388800,
        link: 'https://zoom.us/1',
        color: 'bg-purple-100',
    },
];

const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        monthIndex: dayjs().month(),
        year: dayjs().year(),
        smallCalendarMonth: null,
        daySelected: dayjs(),
        showEventModal: false,
        selectedEvent: null,
        labels: [],
        savedEvents: tasks,
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
    },
});

export const calendarActions = calendarSlice.actions;

export default calendarSlice.reducer;
