import { useDispatch, useSelector } from 'react-redux';
import { DAYOFWEEK, HOURS } from '../../constants/common';
import {
    getCurrentDayClass,
    getDurationMinutes,
    getStartMinutes,
    isDaySelected,
    setBackgroundColor,
} from '../../utils';
import { calendarActions } from '../../store/slices/CalendarSlice';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

function WeekView({ week }) {
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);

    // Redux States
    const daySelected = useSelector((state) => state.calendar.daySelected);
    const meetings = useSelector((state) => state.meeting.userMeetings);
    const projects = useSelector((state) => state.project.projects);

    /**
     * Filters meetings that belong to the current week.
     * Updates whenever the list of meetings or displayed week changes.
     */
    useEffect(() => {
        const events = meetings.filter((evt) => {
            const eventDate = dayjs(evt.startTime * 1000);

            return week.some((day) => eventDate.isSame(day, 'day'));
        });
        setEvents(events);
    }, [meetings, week]);

    /**
     * Converts a Unix timestamp (in seconds) to formatted 12-hour time.
     * @param {number} dateObj - Unix timestamp (seconds)
     * @returns {string} - Formatted time (e.g., "09:30 AM")
     */
    function formatDateTime(dateObj) {
        const date = new Date(dateObj * 1000);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const hourStr = String(hours).padStart(2, '0');
        const minuteStr = String(minutes).padStart(2, '0');
        return `${hourStr}:${minuteStr} ${ampm}`;
    }

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
                                className="border-b border-l border-gray-200 h-11 text-base flex items-center justify-center pr-2"
                            >
                                {hour}
                            </div>
                        ))}
                    </div>
                    {/* Day columns */}
                    {week.map((day, idx) => (
                        <div key={idx} className="border-r border-gray-200 relative">
                            {HOURS.map((_, i) => (
                                <div key={i} className="h-11 border-b border-gray-200"></div>
                            ))}

                            {events
                                .filter((event) => dayjs(event.startTime * 1000).isSame(day, 'day'))
                                .map((event, eIdx) => {
                                    const project = projects.find((proj) => proj.id === event.projectId);
                                    return (
                                        <WeekEventItem
                                            key={eIdx}
                                            event={event}
                                            project={project}
                                            formatDateTime={formatDateTime}
                                        />
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function WeekEventItem({ event, project, formatDateTime }) {
    const [isHovering, setIsHovering] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const innerRef = useRef(null);

    useEffect(() => {
        if (isHovering && innerRef.current) {
            setContentHeight(innerRef.current.scrollHeight + 2);
        } else {
            setContentHeight(null);
        }
    }, [isHovering]);

    const startMinutes = getStartMinutes(event.startTime);
    const durationMinutes = getDurationMinutes(event.startTime, event.endTime);

    const pxPerMinute = 44 / 60;
    const topPosition = startMinutes * pxPerMinute;
    const defaultHeight = durationMinutes * pxPerMinute;

    const colorClass = setBackgroundColor(project.color);

    return (
        <div
            className="absolute left-1 right-1 border-y border-r border-l-5 rounded-md shadow-md cursor-pointer transition-all duration-300 ease-in-out"
            style={{
                top: `${topPosition}px`,
                minHeight: `${contentHeight || defaultHeight}px`,
                backgroundColor: colorClass.lightColor,
                borderColor: colorClass.darkColor,
            }}
            onMouseEnter={() => (defaultHeight < 44 ? setIsHovering(true) : null)}
            onMouseLeave={() => (defaultHeight < 44 ? setIsHovering(false) : null)}
        >
            <div
                ref={innerRef}
                className="px-3 py-1 absolute inset-0 overflow-hidden hover:overflow-visible hover:h-fit rounded-md"
                style={{ color: colorClass.darkColor }}
            >
                <div className="text-lg font-semibold">{formatDateTime(event.startTime)}</div>
                <div className="text-lg font-semibold">{event.title}</div>
            </div>
        </div>
    );
}

export default WeekView;
