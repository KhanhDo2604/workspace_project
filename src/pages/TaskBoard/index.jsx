import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button';
import assets from '../../constants/icon';
import TaskCard from './TaskCard';
import ProjectHeader from '../../components/ProjectHeader';

function TaskBoardPage() {
    const tasks = [
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

    return (
        <div className="size-full ">
            <ProjectHeader {...teamInfo} />

            <div className="px-8 py-5">
                <h1 className="text-2xl font-bold">Task Board</h1>
                <div className="grid grid-cols-4 gap-8 h-2/3 mt-4">
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="rounded-full bg-blue-300 text-blue-950 size-9 text-lg mr-2 flex justify-center items-center">
                                {tasks.filter((task) => task.status === 'todo').length}
                            </div>
                            <h2 className="text-xl font-bold">To Do</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {tasks
                                .filter((task) => task.status === 'todo')
                                .map((e) => (
                                    <TaskCard key={e.id} {...e} />
                                ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="rounded-full bg-red-200 text-red-950 size-9 text-lg mr-2 flex justify-center items-center">
                                {tasks.filter((task) => task.status === 'in-progress').length}
                            </div>
                            <h2 className="text-xl font-bold">In Progress</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {tasks
                                .filter((task) => task.status === 'in-progress')
                                .map((e) => (
                                    <TaskCard key={e.id} {...e} />
                                ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="rounded-full bg-yellow-100 text-yellow-950 size-9 text-lg mr-2 flex justify-center items-center">
                                {tasks.filter((task) => task.status === 'review').length}
                            </div>
                            <h2 className="text-xl font-bold">Review</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {tasks
                                .filter((task) => task.status === 'review')
                                .map((e) => (
                                    <TaskCard key={e.id} {...e} />
                                ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center mb-2">
                            <div className="rounded-full bg-green-200 text-green-950 size-9 text-lg mr-2 flex justify-center items-center">
                                {tasks.filter((task) => task.status === 'done').length}
                            </div>
                            <h2 className="text-xl font-bold">Done</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {tasks
                                .filter((task) => task.status === 'done')
                                .map((e) => (
                                    <TaskCard key={e.id} {...e} />
                                ))}
                        </div>
                    </div>
                </div>
                <Button
                    variant="text"
                    className="mt-4 text-stroke"
                    startIcon={<FontAwesomeIcon icon={assets.icon.add} size="sm" />}
                >
                    <p className="font-bold text-lg leading-0">Create</p>
                </Button>
            </div>
        </div>
    );
}

export default TaskBoardPage;
