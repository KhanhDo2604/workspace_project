import { createSlice } from '@reduxjs/toolkit';

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState: {
        currentTab: '',
    },
    reducers: {
        setCurrentTab: (state, action) => {
            state.currentTab = action.payload;
        },
    },
});

export const sideBarActions = sideBarSlice.actions;
export default sideBarSlice.reducer;
