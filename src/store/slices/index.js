import { createSlice } from '@reduxjs/toolkit';

const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        openSetting: false,
        openNotification: false,
    },
    reducers: {
        openSetting: (state) => {
            state.openSetting = true;
        },
        closeSetting: (state) => {
            state.openSetting = false;
        },
        openNotification: (state) => {
            state.openNotification = true;
        },
        closeNotification: (state) => {
            state.openNotification = false;
        },
    },
});

export const dialogActions = dialogSlice.actions;
export default dialogSlice.reducer;
