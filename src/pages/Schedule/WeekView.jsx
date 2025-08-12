import { useDispatch, useSelector } from 'react-redux';
import { DAYOFWEEK, HOURS } from '../../constants/common';
import { getCurrentDayClass, getStartHour, isDaySelected } from '../../utils';
import { calendarActions } from '../../store/slices/CalendarSlice';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function WeekView({ week }) {
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);
    const daySelected = useSelector((state) => state.calendar.daySelected);
    const savedEvents = useSelector((state) => state.calendar.savedEvents);

    useEffect(() => {
        const events = savedEvents.filter((evt) => {
            const eventDate = dayjs(evt.date * 1000);
            return week.some((day) => eventDate.isSame(day, 'day'));
        });
        setEvents(events);
    }, [savedEvents, week]);

    return (
        <div className="w-full flex flex-col">
            <div className="grid grid-cols-8">
                <div className="border border-gray-200"></div>
                {DAYOFWEEK.flat().map((day, idx) => (
                    <div
                        className="border-r border-t border-b border-gray-200 p-2 flex flex-col items-center justify-center cursor-pointer"
                        key={idx}
                        onClick={() => {
                            dispatch(calendarActions.setDaySelected(week[idx].format('DD-MM-YY')));
                        }}
                    >
                        <p className="text-lg font-bold">{day}</p>
                        <p
                            className={`text-lg size-8 flex items-center justify-center ${getCurrentDayClass(
                                week[idx],
                            )}  ${isDaySelected(daySelected, week[idx])}`}
                        >
                            {week[idx].format('DD')}
                        </p>
                    </div>
                ))}
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
                                className="border-b border-l border-gray-200 h-[44px] text-base flex items-center justify-center pr-2"
                            >
                                {hour}
                            </div>
                        ))}
                    </div>
                    {/* Day columns */}
                    {week.map((day, idx) => (
                        <div key={idx} className="border-r border-gray-200 relative">
                            {HOURS.map((_, i) => (
                                <div key={i} className="h-[44px] border-b border-gray-200"></div>
                            ))}

                            {events
                                .filter((event) => dayjs(event.date * 1000).isSame(day, 'day'))
                                .map((event, eIdx) => {
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WeekView;
