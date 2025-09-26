import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    addMemberToProjectService,
    createProjectService,
    createTaskService,
    deleteProjectService,
    deleteTaskService,
    getAllProjectsService,
    getChatMessagesService,
    getProjectTasksService,
    removeMemberFromProjectService,
    updateProjectService,
    updateTaskService,
    updateTaskStatusService,
} from '../../services/ProjectService';
import ProjectModel from '../../model/ProjectModel';
import TaskModel from '../../model/TaskModel';

export const createProject = createAsyncThunk(
    'api/project/create',
    async ({ title, projectName, userId, color }, thunkAPI) => {
        try {
            const res = await createProjectService(title, projectName, userId, color);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Create project failed');
        }
    },
);

export const updateProject = createAsyncThunk('api/project/update', async (projectData, thunkAPI) => {
    try {
        const res = await updateProjectService(
            projectData.projectId,
            projectData.title,
            projectData.projectName,
            projectData.participants,
        );

        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Update project failed');
    }
});

export const deleteProject = createAsyncThunk('api/project/delete', async (projectId, thunkAPI) => {
    try {
        const res = await deleteProjectService(projectId);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Delete project failed');
    }
});

export const getAllProjects = createAsyncThunk('api/project/user', async (userId, thunkAPI) => {
    try {
        const res = await getAllProjectsService(userId);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Get all projects failed');
    }
});

export const getChatMessages = createAsyncThunk('api/chat/messages', async (projectId, thunkAPI) => {
    try {
        const res = await getChatMessagesService(projectId);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Get chat messages failed');
    }
});

export const addMemberToProject = createAsyncThunk('api/project/add-member', async ({ projectId, email }, thunkAPI) => {
    try {
        const res = await addMemberToProjectService(projectId, email);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Add member to project failed');
    }
});

export const removeMemberFromProject = createAsyncThunk(
    'api/project/remove-member',
    async ({ projectId, memberId }, thunkAPI) => {
        try {
            const res = await removeMemberFromProjectService(projectId, memberId);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Remove member from project failed');
        }
    },
);

export const createTask = createAsyncThunk('api/project/create-task', async (taskData, thunkAPI) => {
    try {
        const res = await createTaskService(
            taskData.project,
            taskData.title,
            taskData.description,
            taskData.assignees,
            taskData.types,
            taskData.startDay,
            taskData.dueDay,
        );

        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Create task failed');
    }
});

export const updateTask = createAsyncThunk('api/project/update-task', async (taskData, thunkAPI) => {
    try {
        const res = await updateTaskService(
            taskData.id,
            taskData.title,
            taskData.description,
            taskData.userIds,
            taskData.types,
            taskData.startDay,
            taskData.dueDay,
        );

        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Update task failed');
    }
});

export const updateTaskStatus = createAsyncThunk(
    'api/project/update-status',
    async ({ taskId, newStatus }, thunkAPI) => {
        try {
            const res = await updateTaskStatusService(taskId, newStatus);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Update task status failed');
        }
    },
);

export const deleteTask = createAsyncThunk('api/project/delete-task', async (taskId, thunkAPI) => {
    try {
        const res = await deleteTaskService(taskId);
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Delete task failed');
    }
});

export const getProjectTasks = createAsyncThunk('api/project/get-task', async (projectId, thunkAPI) => {
    try {
        const res = await getProjectTasksService(projectId);
        res.tasks = res.tasks.map(
            (task) =>
                new TaskModel(
                    task._id,
                    task.title,
                    task.description,
                    task.startDay,
                    task.dueDay,
                    task.userIds,
                    task.status,
                    task.types,
                    task.subTasks,
                    task.project,
                ),
        );
        return res;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || 'Get project tasks failed');
    }
});

const projectSlice = createSlice({
    name: 'project',
    initialState: {
        projects: [],
        loading: false,
        error: null,
        message: null,
        tasks: [],
        currentProject: new ProjectModel(),
        chat: [],
    },
    reducers: {
        setCurrentProject(state, action) {
            state.currentProject = new ProjectModel(
                action.payload.id,
                action.payload.title,
                action.payload.description,
                action.payload.host || {},
                action.payload.participants || [],
            );
        },
        setNewStatus(state, action) {
            const { taskId, newStatus } = action.payload;
            state.tasks = state.tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(
                    new ProjectModel(
                        action.payload.project._id,
                        action.payload.project.title,
                        action.payload.project.projectName,
                        action.payload.project.host,
                        action.payload.project.participants || [],
                        action.payload.project.color,
                    ),
                );
                state.message = action.payload.message;
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex((proj) => proj.id === action.payload.project._id);
                if (index !== -1) {
                    state.projects[index] = new ProjectModel(
                        action.payload.project._id,
                        action.payload.project.title,
                        action.payload.project.projectName,
                        action.payload.project.host,
                        action.payload.project.participants || [],
                        action.payload.project.color,
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(deleteProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = state.projects.filter((proj) => proj.id !== action.payload.projectId);
                state.message = action.payload.message;
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(getAllProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getAllProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload.projects.map(
                    (proj) =>
                        new ProjectModel(
                            proj._id,
                            proj.title,
                            proj.projectName,
                            proj.host,
                            proj.participants || [],
                            proj.color,
                        ),
                );
                state.message = action.payload.message;
            })
            .addCase(getAllProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(addMemberToProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(addMemberToProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex((proj) => proj.id === action.payload.project._id);
                if (index !== -1) {
                    state.projects[index] = new ProjectModel(
                        action.payload.project._id,
                        action.payload.project.title,
                        action.payload.project.projectName,
                        action.payload.project.host,
                        action.payload.project.participants || [],
                        action.payload.project.color,
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(addMemberToProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(removeMemberFromProject.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(removeMemberFromProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex((proj) => proj.id === action.payload.project._id);
                if (index !== -1) {
                    state.projects[index] = new ProjectModel(
                        action.payload.project._id,
                        action.payload.project.title,
                        action.payload.project.projectName,
                        action.payload.project.host,
                        action.payload.project.participants || [],
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(removeMemberFromProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(TaskModel.fromPayload(action.payload.task));
                state.message = action.payload.message;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(getProjectTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getProjectTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload.tasks
                    .map((task) => {
                        return new TaskModel(
                            task.id,
                            task.title,
                            task.description,
                            task.startDay,
                            task.dueDay,
                            task.userIds,
                            task.status,
                            task.types,
                            task.subtasks,
                            task.project,
                        );
                    })
                    .sort((a, b) => new Date(a.startDay) - new Date(b.startDay));

                state.message = action.payload.message;
            })
            .addCase(getProjectTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task.id === action.payload.task._id);
                if (index !== -1) {
                    state.tasks[index] = new TaskModel(
                        action.payload.task._id,
                        action.payload.task.title,
                        action.payload.task.description,
                        action.payload.task.startDay,
                        action.payload.task.dueDay,
                        action.payload.task.userIds,
                        action.payload.task.status,
                        action.payload.task.types,
                        action.payload.task.subTasks,
                        action.payload.task.project,
                    );
                }
                state.message = action.payload.message;
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter((task) => {
                    return task.id !== action.payload.taskId;
                });
                state.message = action.payload.message;
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
        builder
            .addCase(getChatMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getChatMessages.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.length > 0) {
                    state.chat = action.payload;
                }
                state.message = action.payload.message;
            })
            .addCase(getChatMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const projectActions = projectSlice.actions;
export default projectSlice.reducer;
