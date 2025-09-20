import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, logout, requestPasswordReset, resetPassword, signup } from '../../services/AuthService';
import { getAllUsersTaskService, getUserInfoService } from '../../services/UserService';
import UserModel from '../../model/UserModel';
import TaskModel from '../../model/TaskModel';

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

export const signupUser = createAsyncThunk('api/auth/signup', async ({ email, password, userName }, thunkAPI) => {
    try {
        const res = await signup(email, password, userName);

        return res;
    } catch (error) {
        throw thunkAPI.rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
});

export const requestPasswordResetUser = createAsyncThunk('api/auth/forgot-password', async (email, thunkAPI) => {
    try {
        return await requestPasswordReset(email); //token
    } catch (err) {
        throw thunkAPI.rejectWithValue(err.response?.data?.message || 'Password reset request failed');
    }
});

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

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await logout();
        return true;
    } catch (err) {
        throw thunkAPI.rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
});

export const getUserInformation = createAsyncThunk('api/user', async (userId, thunkAPI) => {
    try {
        const response = await getUserInfoService(userId);
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const getAllUsersTask = createAsyncThunk('api/users', async (userId, thunkAPI) => {
    try {
        const response = await getAllUsersTaskService(userId);
        return response;
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
                state.user = {
                    userId: action.payload._id,
                    email: action.payload.email,
                    name: action.payload.name,
                };
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
    },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
