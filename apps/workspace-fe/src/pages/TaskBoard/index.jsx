import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

import assets from '../../constants/icon';
import ProjectHeader from '../../components/ProjectHeader';
import Column from './Column';
import TaskCard from './TaskCard';
import { Button } from '../../components/ui/button';
import { CreateTaskModal } from '../../components/CreateTaskModal';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, getProjectTasks, updateTaskStatus } from '../../store/slices/ProjectSlice';
import TaskModel from '../../model/TaskModel';

/** Kanban board columns definition */
const COLUMNS = [
    { id: 0, title: 'To Do' },
    { id: 1, title: 'In Progress' },
    { id: 2, title: 'Review' },
    { id: 3, title: 'Done' },
];
function TaskBoardPage() {
    const dispatch = useDispatch();

    // State Management
    const [activeTask, setActiveTask] = useState(null);
    const currentProject = useSelector((state) => state.project.currentProject);
    const tasks = useSelector((state) => state.project.tasks);

    // Define sensors for mouse and touch inputs (used for drag & drop)
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });
    const sensors = useSensors(mouseSensor, touchSensor);

    // Fetch project tasks when component mounts or project changes
    useEffect(() => {
        const fetchTasks = async () => {
            if (currentProject && currentProject.id) {
                try {
                    await dispatch(getProjectTasks(currentProject.id)).unwrap();
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                }
            }
        };
        fetchTasks();
    }, [dispatch, currentProject]);

    /**
     * Triggered when a drag operation starts
     * @param {object} event - DnD event containing the active task
     */
    function handleDragStart(event) {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task);
    }

    /**
     * Triggered when a drag operation ends (task dropped)
     * Updates the task’s status both locally and in the database
     * @param {object} event - DnD event containing active and over columns
     */
    async function handleDragEnd(event) {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        dispatch({ type: 'project/setNewStatus', payload: { taskId, newStatus } });
        await dispatch(updateTaskStatus({ taskId, newStatus })).unwrap();
    }

    /**
     * Handles creation of a new task and updates Redux state
     * @param {object} args - Task data (title, description, etc.)
     */
    async function createNewTask(args) {
        try {
            const response = await dispatch(createTask(args)).unwrap();
            TaskModel.fromObject(response.task);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    }

    return (
        <div className="size-full flex flex-col">
            {/* Project Header */}
            <ProjectHeader
                teamName={currentProject.title}
                teamDescription={currentProject.description}
                teamMembers={currentProject.participants}
            />

            <div className="px-8 py-5 flex-1 flex flex-col min-h-0">
                <h1 className="text-2xl font-bold">Task Board</h1>

                {/* Main Kanban grid with drag-and-drop context */}
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
                    <div className="grid grid-cols-4 gap-8 flex-1 mt-4 min-h-0">
                        {COLUMNS.map((column) => {
                            return (
                                <Column
                                    key={column.id}
                                    column={column}
                                    tasks={tasks.filter((task) => task.status === column.id)}
                                />
                            );
                        })}
                    </div>

                    {/* Drag overlay shows the card being moved */}
                    <DragOverlay>
                        {activeTask ? <TaskCard task={activeTask} className="z-50 shadow-2xl" /> : null}
                    </DragOverlay>
                </DndContext>

                {/* Button and modal for creating a new task */}
                <CreateTaskModal
                    onSave={createNewTask}
                    triggerBtn={
                        <Button
                            variant="text"
                            className="my-4 text-stroke self-start hover:shadow-white"
                            data-testid={'task-create-btn'}
                        >
                            <FontAwesomeIcon icon={assets.icon.add} size="sm" />
                            <p className="font-bold text-2xl leading-0">Create</p>
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

export default TaskBoardPage;
