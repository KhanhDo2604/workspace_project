import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import assets from '../../constants/icon';
import ProjectHeader from '../../components/ProjectHeader';
import FormField from '../../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { convertToStartOfDay, dayIndexFrom, formatDate, minutesIntoDay } from '../../utils';
import { addDays, addMonths, differenceInCalendarDays } from 'date-fns';
import { CreateTaskModal } from '../../components/CreateTaskModal';
import { CalendarButton } from '../../components/CalendarButton';
import { createTask } from '../../store/slices/ProjectSlice';
import TaskModel from '../../model/TaskModel';
import UpdateTaskModal from '../../components/UpdateTaskModal';
import { Button } from '../../components/ui/button';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

dayjs.extend(isBetween);

const DAY_PX = 161;
const rowHeight = 60;
const MIN_PER_DAY = 1440;
const pxPerMinute = DAY_PX / MIN_PER_DAY;

const UpperSection = ({
    onCreateTask,
    users,
    projectDescription,
    onSearchChange,
    onDateSelect,
    onResetFilters,
    filterDate,
}) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h1 className="text-3xl font-bold">Project {projectDescription}</h1>
                    <p className="text-base text-gray-500">Shared Project</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-5">
                <div className="flex flex-1">
                    {/* Search by title */}
                    <FormField
                        icon={assets.icon.search}
                        className="px-3 min-w-[200px] w-[400px] mr-4"
                        placeholder="Search by title"
                        onChange={(e) => onSearchChange(e.target.value)}
                    />

                    <div className="flex items-center -space-x-2 mr-4">
                        {users.slice(0, 3).map((user, idx) => (
                            <Avatar className="w-10 h-10 rounded-full border-2 border-white" key={idx}>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        ))}
                        {users.length > 3 && (
                            <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex justify-center items-center text-sm text-gray-500">
                                +{users.length - 3}
                            </div>
                        )}
                    </div>

                    <CalendarButton
                        showTime={false}
                        onChange={(timestamp) => {
                            onDateSelect(new Date(timestamp));
                        }}
                    />

                    {filterDate && (
                        <Button variant="outline" className="ml-4 border-tertiary" onClick={onResetFilters}>
                            Reset Filters
                        </Button>
                    )}
                </div>
                <CreateTaskModal
                    onSave={onCreateTask}
                    triggerBtn={
                        <Button className="rounded-md" variant="primary">
                            <FontAwesomeIcon icon={assets.icon.add} className="text-headline" />
                            <span className="text-white leading-0 py-4">Create Task</span>
                        </Button>
                    }
                />
            </div>
        </div>
    );
};

function TimelinePage() {
    const dispatch = useDispatch();

    const startDate = useMemo(() => new Date(), []);
    const endDate = useMemo(() => addMonths(startDate, 1), [startDate]);
    const totalDays = useMemo(() => differenceInCalendarDays(endDate, startDate), [startDate, endDate]);
    const days = useMemo(
        () => Array.from({ length: totalDays }, (_, i) => addDays(startDate, i)),
        [totalDays, startDate],
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState(null);

    const tasks = useSelector((state) => state.project.tasks);
    const currentProject = useSelector((state) => state.project.currentProject);

    const resetFilters = () => {
        setSearchQuery('');
        setFilterDate(null);
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.trim().toLowerCase());

            const matchesDate = filterDate
                ? dayjs(filterDate).isBetween(
                      dayjs(new Date(task.startDay * 1000)).startOf('day'),
                      dayjs(new Date(task.dueDay * 1000)).endOf('day'),
                      'day',
                      '[]',
                  )
                : true;

            return matchesSearch && matchesDate;
        });
    }, [tasks, searchQuery, filterDate]);

    const flexibleHeight = useMemo(() => {
        return filteredTasks.length * rowHeight > window.innerHeight - 260
            ? `${filteredTasks.length * rowHeight}px`
            : '100%';
    }, [filteredTasks]);

    async function createNewTask(args) {
        try {
            const response = await dispatch(createTask(args)).unwrap();
            TaskModel.fromPayload(response.task);
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ProjectHeader
                teamName={currentProject.title}
                teamDescription={currentProject.description}
                teamMembers={currentProject.participants}
            />

            <div className="p-5 flex flex-col flex-1 min-h-0 relative">
                <UpperSection
                    users={currentProject.participants}
                    onCreateTask={createNewTask}
                    projectDescription={currentProject.description}
                    onSearchChange={setSearchQuery}
                    onDateSelect={setFilterDate}
                    onResetFilters={resetFilters}
                    filterDate={filterDate}
                />

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
                                        {filteredTasks.map((task, idx) => {
                                            const taskStart = Number(task.startDay) * 1000;
                                            const taskEnd = Number(task.dueDay) * 1000;

                                            const timelineStart = days[0];
                                            const timelineEnd = days[days.length - 1];

                                            if (
                                                convertToStartOfDay(taskEnd).isBefore(
                                                    convertToStartOfDay(timelineStart),
                                                ) ||
                                                convertToStartOfDay(taskStart).isAfter(convertToStartOfDay(timelineEnd))
                                            )
                                                return null;

                                            const clampedStart = Math.max(
                                                taskStart,
                                                dayjs(timelineStart).startOf('day').valueOf(),
                                            );
                                            const clampedEnd = Math.min(
                                                taskEnd,
                                                dayjs(timelineEnd).endOf('day').valueOf(),
                                            );

                                            const startDayIdx = Math.max(0, dayIndexFrom(clampedStart, timelineStart));
                                            const startMinInDay = minutesIntoDay(clampedStart);

                                            const endDayIdx = Math.max(0, dayIndexFrom(clampedEnd, timelineStart));
                                            const endMinInDay = minutesIntoDay(clampedEnd);

                                            const leftPx = startDayIdx * DAY_PX + startMinInDay * pxPerMinute;
                                            let rightPx = endDayIdx * DAY_PX + endMinInDay * pxPerMinute;

                                            const widthPx = Math.max(2, rightPx - leftPx);

                                            const daysLeft =
                                                Math.ceil((taskEnd - Date.now()) / (24 * 60 * 60 * 1000)) - 1;
                                            const isOverdue = daysLeft < 0;
                                            const isSoon = daysLeft <= 2 && daysLeft >= 0;
                                            const bgClass = isOverdue
                                                ? 'bg-red-100 border-l-4 border-red-400'
                                                : isSoon
                                                ? 'bg-yellow-50 border-l-4 border-yellow-400'
                                                : 'bg-amber-50';

                                            const isCompact = widthPx < 120;

                                            return (
                                                <UpdateTaskModal
                                                    key={task.id}
                                                    currentTask={task}
                                                    triggerBtn={
                                                        <div
                                                            className={`absolute ${bgClass} rounded-md shadow-sm cursor-pointer`}
                                                            style={{
                                                                top: `${idx * rowHeight}px`,
                                                                left: `${leftPx}px`,
                                                                width: `${widthPx}px`,
                                                                padding: isCompact ? '4px 6px' : '8px 12px',
                                                            }}
                                                        >
                                                            <div className="font-semibold truncate text-sm">
                                                                {task.title}
                                                            </div>
                                                            {!isCompact && (
                                                                <>
                                                                    <span className="block text-xs text-gray-700 mt-0.5">
                                                                        {formatDate(task.startDay * 1000)} -{' '}
                                                                        {formatDate(task.dueDay * 1000)}
                                                                    </span>
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Days Remaining: {Math.max(0, daysLeft)}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    }
                                                />
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
