import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import assets from '../../constants/icon';
import ProjectHeader from '../../components/ProjectHeader';
import FormField from '../../components/FormField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDate } from '../../utils';
import { addDays, addMonths, differenceInCalendarDays } from 'date-fns';
import { CreateTaskModal } from '../../components/CreateTaskModal';
import { CalendarButton } from '../../components/CalendarButton';
import { createTask } from '../../store/slices/ProjectSlice';
import TaskModel from '../../model/TaskModel';
import UpdateTaskModal from '../../components/UpdateTaskModal';
import { Button } from '../../components/ui/button';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const DAY_PX = 161;
const rowHeight = 60;
const pxPerMinute = DAY_PX / (24 * 60);
const dayInMs = 24 * 60 * 60 * 1000;

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
                            <img
                                key={user.id ?? user.email ?? idx}
                                src={user.avatar || assets.image.userTemp}
                                alt={user.name ?? 'user'}
                                title={user.name}
                                className="w-10 h-10 rounded-full border-2 border-white"
                            />
                        ))}
                        {users.length > 3 && (
                            <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex justify-center items-center text-sm text-gray-500">
                                +{users.length - 3}
                            </div>
                        )}
                    </div>

                    {/* Filter by date */}
                    <CalendarButton
                        showTime={false}
                        onChange={(timestamp) => {
                            onDateSelect(new Date(timestamp));
                        }}
                    />

                    {/* Reset Filters */}
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
                                            const taskStartMs = Number(task.startDay) * 1000;
                                            const taskEndMs = Number(task.dueDay) * 1000;

                                            const timelineStartMs = dayjs(days[0]).startOf('day').valueOf();
                                            const timelineEndMs = dayjs(days[days.length - 1])
                                                .endOf('day')
                                                .valueOf();

                                            if (taskEndMs < timelineStartMs || taskStartMs > timelineEndMs) return null;

                                            const visibleStartMs = Math.max(taskStartMs, timelineStartMs);
                                            const visibleEndMs = Math.min(taskEndMs, timelineEndMs);

                                            const minutesFromTimelineStart = Math.floor(
                                                (visibleStartMs - timelineStartMs) / 60000,
                                            );
                                            const left = Math.max(0, minutesFromTimelineStart * pxPerMinute);

                                            const durationMinutes = Math.max(
                                                Math.ceil((visibleEndMs - visibleStartMs) / 60000),
                                                1,
                                            );
                                            const width = durationMinutes * pxPerMinute;

                                            const taskBorderClass =
                                                taskStartMs <= timelineStartMs ? 'rounded-r-md' : 'rounded-md';

                                            return (
                                                <UpdateTaskModal
                                                    key={task.id}
                                                    currentTask={task}
                                                    triggerBtn={
                                                        <div
                                                            className={`bg-amber-50 absolute ${taskBorderClass} shadow-sm text-sm px-3 py-2 overflow-visible cursor-pointer`}
                                                            style={{
                                                                top: `${idx * rowHeight}px`,
                                                                left: `${left}px`,
                                                                width: `${width}px`,
                                                            }}
                                                        >
                                                            <div className="font-semibold truncate">{task.title}</div>
                                                            <span>
                                                                {formatDate(task.startDay * 1000)} -{' '}
                                                                {formatDate(task.dueDay * 1000)}
                                                            </span>

                                                            <div className="text-xs text-gray-600 mt-1">
                                                                Days Remaining:{' '}
                                                                {Math.ceil((taskEndMs - Date.now()) / dayInMs)}
                                                            </div>
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
