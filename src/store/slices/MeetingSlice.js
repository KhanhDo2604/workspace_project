import { createSlice } from '@reduxjs/toolkit';

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        whiteBoardMode: false,
    },
    reducers: {
        toggleWhiteBoardMode: (state) => {
            state.whiteBoardMode = !state.whiteBoardMode;
        },
    },
});

export const meetingActions = meetingSlice.actions;
export default meetingSlice.reducer;
