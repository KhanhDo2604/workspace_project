import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { DndContext } from '@dnd-kit/core';

import Button from '../../components/Button';
import assets from '../../constants/icon';
import TaskCard from './TaskCard';
import ProjectHeader from '../../components/ProjectHeader';
import Column from './Column';

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

    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        setTasks(() =>
            tasks.map((task) =>
                task.id === taskId
                    ? {
                          ...task,
                          status: newStatus,
                      }
                    : task,
            ),
        );
    }

    const TaskList = ({ status, title, color }) => {
        let colorClass = '';

        if (color === 'blue') colorClass = 'bg-blue-300 text-blue-950';
        else if (color === 'red') colorClass = 'bg-red-200 text-red-950';
        else if (color === 'orange') colorClass = 'bg-yellow-100 text-yellow-950';
        else if (color === 'green') colorClass = 'bg-green-200 text-green-950';

        return (
            <div className="flex flex-col min-h-0">
                <div className="flex items-center mb-2">
                    <div className={`rounded-full ${colorClass} size-9 text-lg mr-2 flex justify-center items-center`}>
                        <p className="leading-0">{tasks.filter((task) => task.status === status).length}</p>
                    </div>
                    <h2 className="text-xl font-bold">{title}</h2>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 p-1">
                    {tasks
                        .filter((task) => task.status === status)
                        .map((e) => (
                            <TaskCard key={e.id} {...e} />
                        ))}
                </div>
            </div>
        );
    };

    return (
        <div className="size-full flex flex-col">
            <ProjectHeader {...teamInfo} />

            <div className="px-8 py-5 flex-1 flex flex-col min-h-0">
                <h1 className="text-2xl font-bold">Task Board</h1>

                <div className="grid grid-cols-4 gap-8 flex-1 mt-4 min-h-0">
                    <DndContext onDragEnd={handleDragEnd}>
                        {COLUMNS.map((column) => {
                            return (
                                <Column
                                    key={column.id}
                                    column={column}
                                    tasks={tasks.filter((task) => task.status === column.id)}
                                />
                            );
                        })}
                    </DndContext>
                </div>
                <Button
                    variant="text"
                    className="my-4 text-stroke self-start"
                    startIcon={<FontAwesomeIcon icon={assets.icon.add} size="sm" />}
                >
                    <p className="font-bold text-lg leading-0">Create</p>
                </Button>
            </div>
        </div>
    );
}

export default TaskBoardPage;
