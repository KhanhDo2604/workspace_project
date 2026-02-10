import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice to manage dialog visibility states across the application.
 */
const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        openAddScheduleDialog: false /** Indicates whether the Add Schedule dialog is open */,
    },
    reducers: {
        /**
         * Closes all dialogs in the UI.
         * Useful for global reset actions (e.g., navigation or logout).
         */
        closeAllDialogs: (state) => {
            state.openAddScheduleDialog = false;
        },
        /** Opens the Add Schedule dialog. */
        openAddScheduleDialog: (state) => {
            state.openAddScheduleDialog = true;
        },
        /** Closes the Add Schedule dialog. */
        closeAddScheduleDialog: (state) => {
            state.openAddScheduleDialog = false;
        },
    },
});

export const dialogActions = dialogSlice.actions;
export default dialogSlice.reducer;
