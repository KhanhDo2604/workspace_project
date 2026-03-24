import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { logout, syncUserService } from '../../services/AuthService';
import {
    changeUserInfoService,
    getAllUsersTaskService,
    getUserInfoService,
    updateUserAvatarService,
} from '../../services/UserService';
import UserModel from '../../model/UserModel';
import TaskModel from '../../model/TaskModel';

export const syncUser = createAsyncThunk('api/user/sync', async (token, thunkAPI) => {
    try {
        const data = await syncUserService(token);

        return UserModel.fromObject(data.data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'User sync failed');
    }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        const message = await logout();
        return message;
    } catch (err) {
        throw thunkAPI.rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
});

/** Retrieves information about the logged-in user. */
export const getUserInformation = createAsyncThunk('api/user', async (userId, thunkAPI) => {
    try {
        const response = await getUserInfoService(userId);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/** Retrieves all tasks related to the current user. */
export const getAllUsersTask = createAsyncThunk('api/users', async (userId, thunkAPI) => {
    try {
        const response = await getAllUsersTaskService(userId);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/** Updates a user's name or personal information. */
export const changeUserInfo = createAsyncThunk('api/user/change_name', async ({ userId, newName }, thunkAPI) => {
    try {
        const response = await changeUserInfoService(userId, newName);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/** Updates the user's profile avatar image. */
export const updateUserAvatar = createAsyncThunk('api/user/change-avatar', async ({ userId, file }, thunkAPI) => {
    try {
        const updatedUser = await updateUserAvatarService(userId, file);
        return updatedUser;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        usersTask: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {},
    /**
     * Handles extra reducers for async thunks.
     * Each case manages loading, success, and error states.
     */
    extraReducers: (builder) => {
        builder.addCase(syncUser.fulfilled, (state, action) => {
            state.loading = false;

            state.user = action.payload;
        });

        builder
            .addCase(getUserInformation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getUserInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.user = new UserModel(
                    action.payload._id,
                    action.payload.avatar,
                    action.payload.name,
                    action.payload.email,
                    state.token,
                    action.payload.personalSetting,
                );
                state.message = null;
            });
        builder
            .addCase(getAllUsersTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getAllUsersTask.fulfilled, (state, action) => {
                state.loading = false;
                state.usersTask = action.payload.tasks.map(
                    (task) =>
                        new TaskModel(
                            task._id,
                            task.title,
                            task.description,
                            task.startDay,
                            task.dueDay,
                            task.userIds || [],
                            task.status,
                            task.types || [],
                            task.subtasks || [],
                            task.project || null,
                        ),
                );
                state.message = action.payload.message;
            })
            .addCase(getAllUsersTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
        builder.addCase(changeUserInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.user = {
                ...state.user,
                name: action.payload.user.name || state.user.name,
                avatar: action.payload.user.avatar || state.user.avatar,
            };
            state.message = action.payload.message;
        });
        builder
            .addCase(updateUserAvatar.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateUserAvatar.fulfilled, (state, action) => {
                state.loading = false;
                if (state.user && state.user.userId === action.payload.userId) {
                    state.user = { ...state.user, avatar: action.payload.avatar };
                }
            })
            .addCase(updateUserAvatar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
