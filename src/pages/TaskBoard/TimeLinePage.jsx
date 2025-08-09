import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import assets from '../../constants/icon';
import ProjectHeader from '../../components/ProjectHeader';
import FormField from '../../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate, toStartOfDay } from '../../utils';
import { addDays, addMonths, differenceInCalendarDays } from 'date-fns';
import TaskCreationDialog from './TaskCreationDialog';
import { dialogActions } from '../../store/slices/DialogSlice';
import Button from '../../components/Button';

const users = [
    { name: 'Alice', avatar: '/avatars/alice.png' },
    { name: 'Bob', avatar: '/avatars/bob.png' },
];

const tasks = [
    {
        id: 1,
        title: 'Premium Templates theme update',
        startDate: 1754568000,
        endDate: 1756641600,
        color: 'bg-orange-100',
    },
    {
        id: 2,
        title: 'New feature development',
        startDate: 1754740800,
        endDate: 1755604800,
        color: 'bg-blue-100',
    },
    {
        id: 3,
        title: 'Bug fixes and improvements',
        startDate: 1755172800,
        endDate: 1756036800,
        color: 'bg-green-100',
    },
    {
        id: 4,
        title: 'Documentation updates',
        startDate: 1755432000,
        endDate: 1756468800,
        color: 'bg-purple-100',
    },
    {
        id: 5,
        title: 'Client feedback review',
        startDate: 1755691200,
        endDate: 1756627200,
        color: 'bg-yellow-100',
    },
    {
        id: 6,
        title: 'Team meeting and planning',
        startDate: 1755950400,
        endDate: 1756886400,
        color: 'bg-pink-100',
    },
    {
        id: 7,
        title: 'Marketing campaign launch',
        startDate: 1756209600,
        endDate: 1757145600,
        color: 'bg-red-100',
    },
    {
        id: 8,
        title: 'Performance optimization',
        startDate: 1756468800,
        endDate: 1757404800,
        color: 'bg-teal-100',
    },
];

const teamInfo = {
    teamName: 'Team Alpha',
    teamDescription: 'Track and coordinate social media',
    teamMembers: [{ avatar: '/user1.jpg' }, { avatar: '/user2.jpg' }, { avatar: '/user3.jpg' }],
};

const rowHeight = 60;

const UpperSection = ({ onCreateTask }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-3xl font-bold">Project Track and coordinate social media</h1>
                    <p className="text-base text-gray-500">Shared Project</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-5">
                <div className="flex flex-1">
                    <FormField icon={assets.icon.search} className="px-3 min-w-[200px] w-[400px] mr-4" />
                    <div className="flex items-center space-x-[-12px] mr-4">
                        {users.map((user, idx) => (
                            <img
                                key={idx}
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full border-2 border-white"
                            />
                        ))}
                        <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex justify-center items-center text-sm text-gray-500">
                            12+
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <FormField className="px-3 min-w-[200px] w-[200px] mr-4" type="date" />
                    </div>
                </div>
                <Button
                    startIcon={<FontAwesomeIcon icon={assets.icon.add} className="text-headline" />}
                    className="rounded-xl"
                    onClick={onCreateTask}
                >
                    <span className="text-white leading-0 py-4">Create Task</span>
                </Button>
            </div>
        </div>
    );
};

function TimelinePage() {
    const dispatch = useDispatch();
    const isOpenTaskCreationDialog = useSelector((state) => state.dialog.openTaskCreationDialog);

    const startDate = useMemo(() => new Date(), []);
    const endDate = useMemo(() => addMonths(startDate, 1), [startDate]);
    const totalDays = useMemo(() => differenceInCalendarDays(endDate, startDate), [startDate, endDate]);
    const days = useMemo(
        () => Array.from({ length: totalDays }, (_, i) => addDays(startDate, i)),
        [totalDays, startDate],
    );

    const flexibleHeight = useMemo(() => {
        return tasks.length * rowHeight > window.innerHeight - 260 ? `${tasks.length * rowHeight}px` : '100%';
    }, []);

    return (
        <div className="flex flex-col h-full">
            <ProjectHeader {...teamInfo} />

            <div className="p-5 flex flex-col flex-1 min-h-0 relative">
                <UpperSection onCreateTask={() => dispatch(dialogActions.openTaskCreationDialog())} />
                {isOpenTaskCreationDialog && (
                    <div className="absolute inset-0 z-50">
                        <TaskCreationDialog />
                    </div>
                )}

                <div className="flex flex-col flex-1 min-h-0">
                    <div className="overflow-x-auto">
                        <div className="w-max">
                            {/* Timeline Header */}
                            <div
                                className="grid pointer-events-none"
                                style={{ gridTemplateColumns: `repeat(${totalDays}, 160px)` }}
                            >
                                {days.map((day, idx) => (
                                    <div
                                        key={idx}
                                        className="text-sm font-medium text-gray-600 px-2 border-b py-1 border-r border-gray-200"
                                    >
                                        {formatDate(day)}
                                    </div>
                                ))}
                            </div>
                            <div className="overflow-y-auto overflow-x-clip h-[calc(100vh-260px)] relative">
                                <div className={`relative`} style={{ height: flexibleHeight }}>
                                    <div
                                        className="absolute inset-0 grid"
                                        style={{ gridTemplateColumns: `repeat(${totalDays}, 160px)` }}
                                    >
                                        {days.map((day, i) => (
                                            <div
                                                key={i}
                                                className={`border-r border-gray-200 ${
                                                    formatDate(day) === formatDate(new Date()) ? 'bg-red-100' : ''
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="size-full mt-1">
                                        {tasks.map((task, idx) => {
                                            const taskStart = toStartOfDay(Number(task.startDate) * 1000);
                                            const taskEnd = toStartOfDay(Number(task.endDate) * 1000);
                                            const timelineStart = toStartOfDay(days[0].getTime());
                                            const timelineEnd = toStartOfDay(days[days.length - 1].getTime());

                                            if (taskEnd < timelineStart || taskStart > timelineEnd) return null;

                                            const visibleStart = Math.max(taskStart, timelineStart);
                                            const visibleEnd = Math.min(taskEnd, timelineEnd);

                                            const dayInMs = 24 * 60 * 60 * 1000;
                                            const startIdx = Math.floor((visibleStart - timelineStart) / dayInMs);
                                            const span = Math.max(
                                                1,
                                                Math.ceil((visibleEnd - visibleStart) / dayInMs) + 1,
                                            );

                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`${task.color} absolute rounded-md shadow-md text-sm px-3 py-2`}
                                                    style={{
                                                        top: `${idx * rowHeight}px`,
                                                        left: `${startIdx * 160}px`,
                                                        width: `${span * 160}px`,
                                                    }}
                                                >
                                                    <div className="font-semibold truncate">{task.title}</div>
                                                    <span>
                                                        {formatDate(task.startDate * 1000)} -{' '}
                                                        {formatDate(task.endDate * 1000)}
                                                    </span>
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        Days Remaining: {Math.ceil((taskEnd - Date.now()) / dayInMs)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimelinePage;
