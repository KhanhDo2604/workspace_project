import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calendarActions } from '../../store/slices/CalendarSlice';
import { randomColor } from '../../utils/index';

export default function Day({ day }) {
    const [dayEvents, setDayEvents] = useState([]);
    const savedEvents = useSelector((state) => state.calendar.savedEvents);
    const daySelected = useSelector((state) => state.calendar.daySelected);
    const dispatch = useDispatch();

    useEffect(() => {
        const events = savedEvents.filter((evt) => {
            return dayjs(evt['date'] * 1000).format('DD-MM-YY') === day.format('DD-MM-YY');
        });
        setDayEvents(events);
    }, [savedEvents, day]);

    function getCurrentDayClass() {
        return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ? 'bg-button text-white rounded-full' : '';
    }

    function isSelected() {
        return daySelected === day.format('DD-MM-YY')
            ? 'rounded-full size-8 flex items-center justify-center border border-button'
            : '';
    }

    return (
        <div
            className="border border-gray-200 flex flex-col cursor-pointer p-2"
            onClick={() => {
                dispatch(calendarActions.setDaySelected(day.format('DD-MM-YY')));
                dispatch(calendarActions.setShowEventModal(true));
            }}
        >
            <header className="flex flex-col mb-1">
                <p
                    className={`text-base size-8 flex items-center justify-center ${getCurrentDayClass()} ${isSelected()}`}
                >
                    {day.format('DD')}
                </p>
            </header>
            <div className="flex flex-col flex-1 gap-2">
                {dayEvents.map((evt, idx) => {
                    let colorClass = randomColor();
                    return (
                        <div
                            key={idx}
                            onClick={() => dispatch(calendarActions.setSelectedEvent(evt))}
                            className={`w-full flex items-center rounded text-sm relative truncate`}
                            style={{ backgroundColor: colorClass.lightColor }}
                        >
                            <div
                                className={`rounded-l w-1 h-full mr-1`}
                                style={{ backgroundColor: colorClass.darkColor, minHeight: '16px' }}
                            ></div>
                            <p
                                className={`line-clamp-1 text-ellipsis overflow-hidden m-1`}
                                style={{ color: colorClass.darkColor }}
                            >
                                {evt.title}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
