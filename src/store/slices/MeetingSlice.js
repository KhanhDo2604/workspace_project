import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createMeetingService,
    deleteMeetingService,
    getMeetingsByUserIdService,
    updateMeetingService,
} from '../../services/MeetingService';
import MeetingModel from '../../model/MeetingModel';

export const createMeeting = createAsyncThunk('project/create-meeting', async (meetingData, thunkAPI) => {
    try {
        const res = await createMeetingService(meetingData);

        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const deleteMeeting = createAsyncThunk('project/delete-meeting', async (meetingId, thunkAPI) => {
    try {
        const res = await deleteMeetingService(meetingId);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const updateMeeting = createAsyncThunk('project/update-meeting', async (meetingData, thunkAPI) => {
    try {
        const res = await updateMeetingService(meetingData);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const getMeetingsByUserId = createAsyncThunk('project/get-meetings', async (userId, thunkAPI) => {
    try {
        const data = await getMeetingsByUserIdService(userId);

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
        meetings: [],
        currentMeeting: null,
    },
    reducers: {
        toggleWhiteBoardMode: (state) => {
            state.whiteBoardMode = !state.whiteBoardMode;
        },
        setCurrentMeeting: (state, action) => {
            state.currentMeeting = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createMeeting.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.meetings.push(MeetingModel.fromPayload(action.payload.meeting));
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
                state.meetings = state.meetings.filter((meeting) => meeting.id !== action.payload.meetingId);
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
                const index = state.meetings.findIndex((meeting) => meeting.id === action.payload.meeting._id);

                if (index !== -1) {
                    state.meetings[index] = MeetingModel.fromPayload(action.payload.meeting);
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
                state.meetings = action.payload.meetings.map((meeting) => MeetingModel.fromPayload(meeting));
            })
            .addCase(getMeetingsByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const meetingActions = meetingSlice.actions;
export default meetingSlice.reducer;
