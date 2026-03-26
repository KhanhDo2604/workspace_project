/**
 * Manages meeting-related operations including:
 * - Meeting creation, update, and deletion
 * - Loading user and project-specific meeting lists
 * - Managing whiteboard mode within meeting sessions
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createMeetingService,
    deleteMeetingService,
    getMeetingsByProjectIdService,
    getMeetingsByUserIdService,
    updateMeetingService,
} from '../../services/MeetingService';
import MeetingModel from '../../model/MeetingModel';

/**
 * Async thunk: Create a new meeting event.
 * Calls backend API and returns meeting data on success.
 */
export const createMeeting = createAsyncThunk('project/create-meeting', async (meetingData, thunkAPI) => {
    try {
        const res = await createMeetingService(meetingData);

        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/**
 * Async thunk: Delete meeting.
 * Calls backend API and returns meeting id on success.
 */
export const deleteMeeting = createAsyncThunk('project/delete-meeting', async (meetingId, thunkAPI) => {
    try {
        const res = await deleteMeetingService(meetingId);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/**
 * Async thunk: Update meeting.
 * Calls backend API and returns meeting data on success.
 */
export const updateMeeting = createAsyncThunk('project/update-meeting', async (meetingData, thunkAPI) => {
    try {
        const res = await updateMeetingService(meetingData);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/**
 * Async thunk: Get meetings by user ID.
 * Calls backend API and returns list of meetings on success.
 */
export const getMeetingsByUserId = createAsyncThunk('project/get-meetings', async (userId, thunkAPI) => {
    try {
        const data = await getMeetingsByUserIdService(userId);

        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

/**
 * Async thunk: Get meetings by project ID.
 * Calls backend API and returns list of meetings on success.
 */
export const getMeetingsByProjectId = createAsyncThunk('project/get-meetings-project', async (projectId, thunkAPI) => {
    try {
        const data = await getMeetingsByProjectIdService(projectId);
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        whiteBoardMode: false,
        isLoading: false,
        error: null,
        message: null,
        userMeetings: [],
        projectMeetings: [],
        currentMeeting: null,
        activeMeetings: [],
    },
    reducers: {
        /**
         * Toggles whiteboard mode within a meeting.
         */
        toggleWhiteBoardMode: (state) => {
            state.whiteBoardMode = !state.whiteBoardMode;
        },
        /**
         * Sets the current active meeting for display or edit.
         */
        setCurrentMeeting: (state, action) => {
            state.currentMeeting = action.payload;
        },
        /**
         * Explicitly sets whiteboard mode to a specific value.
         */
        setWhiteBoardMode: (state, action) => {
            state.whiteBoardMode = action.payload;
        },
        addActiveMeeting: (state, action) => {
            const exists = state.activeMeetings.find((m) => m.meetingId === action.payload.meetingId);
            if (!exists) {
                state.activeMeetings.push(action.payload);
            }
        },
        removeActiveMeeting: (state, action) => {
            state.activeMeetings = state.activeMeetings.filter((m) => m.meetingId !== action.payload);
        },
    },
    /**
     * Handles extra reducers for async thunks.
     * Each case manages loading, success, and error states.
     */
    extraReducers: (builder) => {
        builder
            .addCase(createMeeting.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userMeetings.push(MeetingModel.fromObject(action.payload.meeting));
                state.projectMeetings.push(MeetingModel.fromObject(action.payload.meeting));

                state.message = 'Meeting created successfully';
            })
            .addCase(createMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(deleteMeeting.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteMeeting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userMeetings = state.userMeetings.filter((meeting) => meeting.id !== action.payload.meetingId);
                state.projectMeetings = state.projectMeetings.filter(
                    (meeting) => meeting.id !== action.payload.meetingId,
                );
                state.message = 'Meeting deleted successfully';
            })
            .addCase(deleteMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(updateMeeting.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateMeeting.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.userMeetings.findIndex((meeting) => meeting.id === action.payload.meeting._id);
                const projectIndex = state.projectMeetings.findIndex(
                    (meeting) => meeting.id === action.payload.meeting._id,
                );

                if (index !== -1) {
                    state.userMeetings[index] = MeetingModel.fromObject(action.payload.meeting);
                }
                if (projectIndex !== -1) {
                    state.projectMeetings[projectIndex] = MeetingModel.fromObject(action.payload.meeting);
                }
                state.message = 'Meeting updated successfully';
            })
            .addCase(updateMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(getMeetingsByUserId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getMeetingsByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userMeetings = action.payload.meetings
                    .map((meeting) => MeetingModel.fromObject(meeting))
                    .sort((a, b) => b.startTime - a.startTime);
            })
            .addCase(getMeetingsByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(getMeetingsByProjectId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getMeetingsByProjectId.fulfilled, (state, action) => {
                state.isLoading = false;
                const now = Math.floor(Date.now() / 1000);

                state.projectMeetings = action.payload.meetings
                    .map((meeting) => MeetingModel.fromObject(meeting))
                    .filter((meeting) => meeting.startTime >= now)
                    .sort((a, b) => a.startTime - b.startTime);

                const onGoingMeetings = action.payload.meetings.filter(
                    (meeting) => meeting.startTime <= now && meeting.endTime >= now,
                );

                state.activeMeetings = onGoingMeetings;
            })
            .addCase(getMeetingsByProjectId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const meetingActions = meetingSlice.actions;
export default meetingSlice.reducer;
