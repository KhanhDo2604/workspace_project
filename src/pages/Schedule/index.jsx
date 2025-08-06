import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Tooltip } from 'react-tooltip';

import Button from '../../components/Button';
import { APP_STANDARD_DATE_FORMAT } from '../../constants/common';
import assets from '../../constants/icon';
import { formatDate, isSameDay, randomColor } from '../../utils';

function SchedulePage() {
    const [mode, setMode] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [showMonthPicker, setShowMonthPicker] = useState(false);

    const modes = ['day', 'week', 'month'];
    const tasks = [
        {
            id: 1,
            title: 'Monthly catch-up Monthly catch-up',
            time: '08:15 AM',
            date: '04-08-2025',
            link: 'https://zoom.us/1',
            color: 'bg-green-100',
        },
        {
            id: 2,
            title: '1:1 with Heather',
            time: '09:00 AM',
            date: '04-08-2025',
            link: 'https://zoom.us/1',
            color: 'bg-blue-100',
        },
        {
            id: 4,
            title: '1:1 with Heather',
            time: '09:00 AM',
            date: '04-08-2025',
            link: 'https://zoom.us/1',
            color: 'bg-blue-100',
        },
        {
            id: 3,
            title: 'EOD Demo Sync',
            time: '12:00 PM',
            date: '17-08-2025',
            link: 'https://zoom.us/1',
            color: 'bg-purple-100',
        },
    ];

    useEffect(() => {
        const today = new Date();
        setSelectedDate(today);
    }, []);

    const handlePrevMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setSelectedDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setSelectedDate(newDate);
    };

    const handleMonthPickerChange = (date) => {
        setSelectedDate(date);
    };

    const renderMonth = () => {
        const start = new Date();
        const days = Array.from({ length: 31 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1));
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return (
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {dayOfWeek.map((day) => (
                    <div key={day} className="p-2 font-semibold bg-gray-100">
                        <p className="text-gray-500 text-xl">{day}</p>
                    </div>
                ))}

                {days.map((day) => (
                    <Button
                        key={day}
                        variant="outline"
                        className={`min-h-[100px] p-1 relative pt-7 text-left flex flex-col items-start bg-white`}
                        onClick={() => {
                            setSelectedDate(day);
                        }}
                    >
                        <div
                            className={`absolute top-1 left-1 text-lg ${
                                isSameDay(selectedDate, day)
                                    ? 'text-headline bg-button w-7 h-7 rounded-full text-center'
                                    : 'text-gray-500'
                            }`}
                        >
                            {day.getDate()}
                        </div>
                        <Tooltip id="my-tooltip" variant="warning" />
                        <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] w-full pr-1">
                            {tasks
                                .filter((t) => t.date === formatDate(day))
                                .map((t) => {
                                    let colorClass = randomColor();
                                    return (
                                        <div
                                            key={t.id}
                                            className={`w-full flex items-center rounded text-sm relative`}
                                            data-tooltip-id="my-tooltip"
                                            style={{ backgroundColor: colorClass.lightColor }}
                                            data-tooltip-content={t.title}
                                        >
                                            <div
                                                className={`rounded-l w-1 h-full mr-1`}
                                                style={{ backgroundColor: colorClass.darkColor, minHeight: '16px' }}
                                            ></div>
                                            <p
                                                className={`line-clamp-1 text-ellipsis overflow-hidden m-1`}
                                                style={{ color: colorClass.darkColor }}
                                            >
                                                {t.title}
                                            </p>
                                        </div>
                                    );
                                })}
                        </div>
                    </Button>
                ))}
            </div>
        );
    };

    const renderWeek = () => {
        const days = Array.from({ length: 7 }, (_, i) => new Date(2023, 0, i + 1));

        return (
            <div className="grid grid-cols-7 border-t">
                {days.map((day) => (
                    <div key={day} className="border-l">
                        <div className="p-1 text-xs font-bold text-center bg-gray-100">{format(day, 'EEE dd')}</div>
                        <div className="h-[600px] p-1 relative">
                            {tasks
                                .filter((t) => t.date === format(day, APP_STANDARD_DATE_FORMAT))
                                .map((t) => (
                                    <div
                                        key={t.id}
                                        className={`absolute top-[${
                                            parseInt(t.time.split(':')[0]) * 50
                                        }px] p-1 text-xs rounded ${t.color}`}
                                    >
                                        <div>{t.time}</div>
                                        <div>{t.title}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDay = () => {
        const timeSlots = Array.from({ length: 10 }, (_, i) => `${8 + i}:00 AM`);
        const tasksToday = tasks.filter((t) => t.date === selectedDate);

        return (
            <div className="p-4">
                <h3 className="text-md mb-4 font-semibold">{format(new Date(selectedDate), 'EEEE, MMMM dd')}</h3>
                {timeSlots.map((slot) => {
                    const task = tasksToday.find((t) => t.time.startsWith(slot.split(':')[0]));
                    return (
                        <div key={slot} className="border-t py-2">
                            <div className="text-sm text-gray-600">{slot}</div>
                            {task && (
                                <div className={`mt-1 p-2 rounded ${task.color}`}>
                                    <div className="text-sm font-medium">{task.title}</div>
                                    <a className="text-xs text-blue-600" href={task.link} target="_blank">
                                        {task.link}
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="size-full px-8 pb-8">
            <div className="flex items-center justify-between border border-gray-200 p-4 mb-8">
                {/* HEADER */}
                <div className="flex items-center justify-center">
                    <FontAwesomeIcon
                        icon={assets.icon.leftChevron}
                        className="text-button"
                        size="lg"
                        onClick={handlePrevMonth}
                    />
                    {/* <Button variant="text" onClick={() => setShowMonthPicker(true)} className="text-stroke">
                        <h2 className="text-2xl font-bold">{format(new Date(selectedDate), 'MMMM yyyy')}</h2>
                    </Button> */}

                    <FontAwesomeIcon
                        icon={assets.icon.rightChevron}
                        className="text-button"
                        size="lg"
                        onClick={handleNextMonth}
                    />
                </div>
                <div className="flex space-x-2">
                    {modes.map((m) => (
                        <Button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1 rounded-xl text-[#003861] ${
                                mode === m ? 'bg-button' : 'bg-gray-100'
                            }`}
                        >
                            <p className={mode === m ? 'font-bold' : ''}>{m.charAt(0).toUpperCase() + m.slice(1)}</p>
                        </Button>
                    ))}
                </div>
            </div>

            {mode === 'month' && renderMonth()}
            {mode === 'week' && renderWeek()}
            {mode === 'day' && renderDay()}
        </div>
    );
}

export default SchedulePage;
