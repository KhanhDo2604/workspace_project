import { createSlice } from '@reduxjs/toolkit';

const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        openSetting: false,
        openNotification: false,
    },
    reducers: {
        toggleSetting: (state) => {
            state.openSetting = !state.openSetting;
            if (state.openSetting) {
                state.openNotification = false;
            }
        },
        closeSetting: (state) => {
            state.openSetting = false;
        },
        closeAllDialogs: (state) => {
            state.openSetting = false;
            state.openNotification = false;
        },
        toggleNotification: (state) => {
            state.openNotification = !state.openNotification;
            if (state.openNotification) {
                state.openSetting = false;
            }
        },
    },
});

export const dialogActions = dialogSlice.actions;
export default dialogSlice.reducer;
