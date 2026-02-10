import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice for managing sidebar navigation state.
 * Stores the currently selected tab so that the sidebar can
 * maintain active state across components.
 */
const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState: {
        currentTab: '',
    },
    reducers: {
        // Updates the currently active sidebar tab.
        setCurrentTab: (state, action) => {
            state.currentTab = action.payload;
        },
    },
});

// Export actions and reducer
export const sideBarActions = sideBarSlice.actions;
export default sideBarSlice.reducer;
