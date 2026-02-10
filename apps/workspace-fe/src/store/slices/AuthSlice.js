import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, logout, requestPasswordReset, resetPassword, signup } from '../../services/AuthService';
import {
    changeUserInfoService,
    getAllUsersTaskService,
    getUserInfoService,
    updateUserAvatarService,
} from '../../services/UserService';
import UserModel from '../../model/UserModel';
import TaskModel from '../../model/TaskModel';

/** Authenticates a user using email and password. */
export const loginUser = createAsyncThunk('api/auth/login', async ({ email, password }, thunkAPI) => {
    try {
        const res = await login(email, password);

        if (res.status === 401) {
            throw new Error(res.message);
        } else {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user_id', res.data.userId);

            return res;
        }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

/** Registers a new user account. */
export const signupUser = createAsyncThunk('api/auth/signup', async ({ email, password, userName }, thunkAPI) => {
    try {
        const res = await signup(email, password, userName);

        return res;
    } catch (error) {
        throw thunkAPI.rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
});

/** Requests a password reset email. */
export const requestPasswordResetUser = createAsyncThunk('api/auth/forgot-password', async (email, thunkAPI) => {
    try {
        return await requestPasswordReset(email); //token
    } catch (err) {
        throw thunkAPI.rejectWithValue(err.response?.data?.message || 'Password reset request failed');
    }
});

/** Resets user password using token verification. */
export const resetPasswordUser = createAsyncThunk(
    'api/auth/reset-password',
    async ({ userId, token, password }, thunkAPI) => {
        try {
            return await resetPassword(userId, token, password);
        } catch (error) {
            throw thunkAPI.rejectWithValue(error.response?.data?.message || 'Reset password failed');
        }
    },
);

/** Logs out the current user. */
export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await logout();
        return true;
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
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.data.token;
                state.user = new UserModel(
                    action.payload.data.userId,
                    action.payload.data.avatar,
                    action.payload.data.name,
                    action.payload.data.email,
                    action.payload.data.token,
                    action.payload.data.personalSetting,
                );
                state.message = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = {
                    userId: action.payload.user._id,
                    email: action.payload.user.email,
                    name: action.payload.user.name,
                    token: action.payload.token,
                    personalSetting: action.payload.user.personalSetting,
                };
                state.token = action.payload.token;
                state.message = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
        builder
            .addCase(requestPasswordResetUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(requestPasswordResetUser.fulfilled, (state, action) => {
                state.token = action.payload;
                state.loading = false;
                state.message = null;
            });

        builder
            .addCase(resetPasswordUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPasswordUser.fulfilled, (state) => {
                state.loading = false;
                state.message = null;
            })
            .addCase(resetPasswordUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
                state.message = null;
            });
        builder
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.loading = false;
                state.message = 'Logout successful';
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
