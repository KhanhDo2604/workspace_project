import { createSlice } from '@reduxjs/toolkit';

/**
 * Redux slice for managing user state across the application.
 * This slice currently stores user information retrieved after authentication.
 */
const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
});

// Export actions and reducer for store configuration
export const userActions = userSlice.actions;
export default userSlice.reducer;
