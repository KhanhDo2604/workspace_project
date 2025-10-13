import { useDispatch, useSelector } from 'react-redux';
import { setBackgroundColor } from '../../utils';
import { calendarActions } from '../../store/slices/CalendarSlice';
import dayjs from 'dayjs';
import MeetingModal from '../../components/MeetingModal';

function EventCard({ index, event, isShowTime = false }) {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.project.projects);
    const project = projects.find((proj) => proj.id === event.projectId);
    if (!project) return null;
    let colorClass = setBackgroundColor(project.color);

    return (
        <MeetingModal
            meeting={event}
            triggerBtn={
                <div
                    key={index}
                    onClick={() => dispatch(calendarActions.setSelectedEvent(event))}
                    className={`w-full flex items-center rounded text-sm relative truncate`}
                    style={{ backgroundColor: colorClass.lightColor }}
                >
                    <div
                        className={`rounded-l w-1 h-full mr-1`}
                        style={{ backgroundColor: colorClass.darkColor, minHeight: '16px' }}
                    ></div>
                    <div>
                        {isShowTime && (
                            <p className={`mb-1`} style={{ color: colorClass.darkColor }}>
                                {dayjs(event.startTime * 1000).format('HH:mm')}
                            </p>
                        )}
                        <p
                            className={`line-clamp-1 text-ellipsis overflow-hidden m-1`}
                            style={{ color: colorClass.darkColor }}
                        >
                            {event.title}
                        </p>
                    </div>
                </div>
            }
        />
    );
}

export default EventCard;
