import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import Button from '../../components/Button';
import assets from '../../constants/icon';
import ProjectHeader from '../../components/ProjectHeader';
import Column from './Column';
import TaskCard from './TaskCard';

const INITIAL_TASKS = [
    {
        id: 'T1',
        title: 'Task 1',
        assignees: [
            { name: 'User 1', avatar: assets.image.userTemp },
            { name: 'User 2', avatar: assets.image.userTemp },
        ],
        types: ['Design', 'Q&A'],
        status: 'todo',
    },
    {
        id: 'T2',
        title: 'Task 2',
        assignees: [{ name: 'User 3', avatar: assets.image.userTemp }],
        types: ['Development'],
        status: 'in-progress',
    },
    {
        id: 'T3',
        title: 'Task 3',
        assignees: [],
        types: ['Research', 'Development2'],
        status: 'review',
    },
    {
        id: 'T4',
        title: 'Task 4',
        assignees: [{ name: 'User 4', avatar: assets.image.userTemp }],
        types: ['Design'],
        status: 'todo',
    },
    {
        id: 'T5',
        title: 'Task 5',
        assignees: [{ name: 'User 5', avatar: assets.image.userTemp }],
        types: ['Q&A'],
        status: 'in-progress',
    },
    {
        id: 'T6',
        title: 'Task 6',
        assignees: [{ name: 'User 6', avatar: assets.image.userTemp }],
        types: ['Development'],
        status: 'done',
    },
    {
        id: 'T7',
        title: 'Task 7',
        assignees: [{ name: 'User 7', avatar: assets.image.userTemp }],
        types: ['Research'],
        status: 'todo',
    },
    {
        id: 'T8',
        title: 'Task 8',
        assignees: [{ name: 'User 8', avatar: assets.image.userTemp }],
        types: ['Design'],
        status: 'in-progress',
    },
    {
        id: 'T9',
        title: 'Task 9',
        assignees: [{ name: 'User 9', avatar: assets.image.userTemp }],
        types: ['Q&A'],
        status: 'review',
    },
    {
        id: 'T10',
        title: 'Task 10',
        assignees: [{ name: 'User 10', avatar: assets.image.userTemp }],
        types: ['Development'],
        status: 'todo',
    },
];

const teamInfo = {
    teamName: 'Team Alpha',
    teamDescription: 'Track and coordinate social media',
    teamMembers: [{ avatar: '/user1.jpg' }, { avatar: '/user2.jpg' }, { avatar: '/user3.jpg' }],
};

const COLUMNS = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' },
];
function TaskBoardPage() {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [activeTask, setActiveTask] = useState(null);

    function handleDragStart(event) {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
    }

    return (
        <div className="size-full flex flex-col">
            <ProjectHeader {...teamInfo} />

            <div className="px-8 py-5 flex-1 flex flex-col min-h-0">
                <h1 className="text-2xl font-bold">Task Board</h1>

                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                    <DragOverlay>
                        {activeTask ? <TaskCard task={activeTask} className="z-50 shadow-2xl" /> : null}
                    </DragOverlay>
                </DndContext>

                <Button
                    variant="text"
                    className="my-4 text-stroke self-start hover:shadow-white"
                    startIcon={<FontAwesomeIcon icon={assets.icon.add} size="sm" />}
                >
                    <p className="font-bold text-lg leading-0">Create</p>
                </Button>
            </div>
        </div>
    );
}

export default TaskBoardPage;
