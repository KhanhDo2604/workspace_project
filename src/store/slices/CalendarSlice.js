import { createSlice } from '@reduxjs/toolkit';

import dayjs from 'dayjs';
import { MODES } from '../../constants/common';

const tasks = [
    {
        id: 1,
        title: 'Monthly catch-up Monthly catch-up',
        date: 1754252100,
        link: 'https://zoom.us/1',
        duration: 1,
        color: 'bg-green-100',
    },
    {
        id: 2,
        title: '1:1 with Heather',
        date: 1754254800,
        duration: 1,
        link: 'https://zoom.us/1',
        color: 'bg-blue-100',
    },
    {
        id: 4,
        title: '1:1 with Heather',
        date: 1754258400,
        duration: 1,
        link: 'https://zoom.us/1',
        color: 'bg-blue-100',
    },
    {
        id: 3,
        title: 'EOD Demo Sync',
        date: 1755388800,
        duration: 1,
        link: 'https://zoom.us/1',
        color: 'bg-purple-100',
    },
    {
        id: 5,
        title: 'Weekly Team Sync',
        date: 1754924400,
        duration: 2,
        link: 'https://zoom.us/1',
        color: 'bg-yellow-100',
    },
    {
        id: 6,
        title: 'Weekly Team Sync',
        date: 1754935200,
        duration: 2,
        link: 'https://zoom.us/1',
        color: 'bg-yellow-100',
    },
    {
        id: 7,
        title: 'New Event',
        date: 1755021600,
        duration: 3,
        link: 'https://zoom.us/1',
        color: 'bg-red-100',
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
