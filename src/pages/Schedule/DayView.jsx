import { useEffect, useRef, useState } from 'react';
import { HOURS } from '../../constants/common';
import { getCurrentDayClass, getDurationMinutes, setBackgroundColor } from '../../utils';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

function DayView({ day }) {
    const [events, setEvents] = useState([]);
    const meetings = useSelector((state) => state.meeting.meetings);
    const projects = useSelector((state) => state.project.projects);

    useEffect(() => {
        const events = meetings.filter((evt) => {
            return dayjs(evt.startTime * 1000).format('DD-MM-YY') === day.format('DD-MM-YY');
        });
        setEvents(events);
    }, [meetings, day]);

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
                            const project = projects.find((proj) => proj.id === event.projectId);
                            return (
                                <EventItem key={eIdx} event={event} project={project} formatDateTime={formatDateTime} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function EventItem({ event, project, formatDateTime }) {
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

    const startMinutes = dayjs(event.startTime * 1000).hour() * 60 + dayjs(event.startTime * 1000).minute();
    const topPosition = (startMinutes / 60) * 44;
    const durationMinutes = getDurationMinutes(event.startTime, event.endTime);
    const defaultHeight = (durationMinutes / 60) * 44;

    const colorClass = setBackgroundColor(project.color);

    return (
        <div
            className="absolute left-1 right-1 border-y border-r border-l-5 rounded-md shadow-md cursor-pointer"
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
                className="px-3 py-1 absolute inset-0 overflow-hidden hover:overflow-visible hover:h-fit rounded-md transition-[height] duration-300 ease-in-out"
                style={{
                    backgroundColor: colorClass.lightColor,
                    color: colorClass.darkColor,
                }}
            >
                <div className="text-lg font-semibold">{formatDateTime(event.startTime)}</div>
                <div className="text-lg font-semibold">{event.title}</div>
            </div>
        </div>
    );
}

export default DayView;
