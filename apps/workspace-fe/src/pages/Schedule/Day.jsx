import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calendarActions } from '../../store/slices/CalendarSlice';
import EventCard from './EventCard';
import { getCurrentDayClass, isDaySelected } from '../../utils';

export default function Day({ day }) {
    const dispatch = useDispatch();
    const [dayEvents, setDayEvents] = useState([]);

    // Redux States
    const meetings = useSelector((state) => state.meeting.userMeetings);
    const daySelected = useSelector((state) => state.calendar.daySelected);

    /**
     * Filters meetings that belong to the current day.
     * Updates whenever the list of meetings or displayed day changes.
     */
    useEffect(() => {
        const events = meetings
            .filter((evt) => {
                const evtDay = dayjs(evt.startTime * 1000).startOf('day');
                return evtDay.isSame(day.startOf('day'));
            })
            .sort((a, b) => a.startTime - b.startTime);

        setDayEvents(events);
    }, [meetings, day]);

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
                    className={`text-base size-8 flex items-center justify-center ${getCurrentDayClass(
                        day,
                    )} ${isDaySelected(daySelected, day)}`}
                >
                    {day.format('DD')}
                </p>
            </header>
            <div className="flex flex-col flex-1 gap-2">
                {dayEvents.map((evt, idx) => (
                    <EventCard key={idx} index={idx} event={evt} />
                ))}
            </div>
        </div>
    );
}
