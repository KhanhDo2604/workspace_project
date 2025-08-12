import { useEffect, useState } from 'react';
import { HOURS } from '../../constants/common';
import { getCurrentDayClass, getStartHour } from '../../utils';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

function DayView({ day }) {
    const [events, setEvents] = useState([]);
    const savedEvents = useSelector((state) => state.calendar.savedEvents);

    useEffect(() => {
        const events = savedEvents.filter((evt) => {
            return dayjs(evt['date'] * 1000).format('DD-MM-YY') === day.format('DD-MM-YY');
        });
        setEvents(events);
    }, [savedEvents, day]);

    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-8 row-span-1">
                <div className="border border-gray-200 p-2 col-span-1"></div>
                <div className="border-r border-t border-b border-gray-200 p-2 flex flex-col items-center justify-center col-span-7">
                    <p className="text-lg font-bold">{day.format('dd')}</p>
                    <p className={`text-lg size-8 flex items-center justify-center ${getCurrentDayClass(day)}`}>
                        {day.format('DD')}
                    </p>
                </div>
            </div>

            <div className="flex-1 relative">
                <div
                    className="grid grid-cols-8 h-[calc(100vh-14rem)] overflow-y-scroll"
                    style={{
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {/* Time column */}
                    <div className="border-r border-gray-200">
                        {HOURS.map((hour, i) => (
                            <div
                                key={i}
                                className="border-b border-l border-gray-200 text-base flex items-center justify-center pr-2 h-[44px]"
                            >
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    <div className="border-r border-gray-200 relative col-span-7">
                        {HOURS.map((_, i) => (
                            <div key={i} className="h-[44px] border-b border-gray-200"></div>
                        ))}

                        {events.map((event, eIdx) => {
                            let topPosition = getStartHour(event) * 44;

                            return (
                                <div
                                    key={eIdx}
                                    className="absolute left-1 right-1 bg-blue-100 border border-blue-300 text-xs p-1 rounded"
                                    style={{
                                        top: `${topPosition}px`,
                                        height: `${event.duration * 44}px`,
                                    }}
                                >
                                    <div className="font-semibold">{event.title}</div>
                                    <div className="text-[10px]">{event.time}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DayView;
