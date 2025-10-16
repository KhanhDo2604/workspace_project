import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';

import assets from '../../constants/icon';
import Button from '../../components/Button';
import { MODES } from '../../constants/common';
import { calendarActions } from '../../store/slices/CalendarSlice';

function CalendarHeader() {
    const dispatch = useDispatch();

    // Redux States
    const monthIndex = useSelector((state) => state.calendar.monthIndex);
    const viewMode = useSelector((state) => state.calendar.viewMode);
    const year = useSelector((state) => state.calendar.year);
    const currentDate = dayjs().year(year).month(monthIndex);

    // Handlers for navigating months
    const handlePrevMonth = () => {
        let newMonth = monthIndex - 1;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        dispatch(calendarActions.setMonthYear({ month: newMonth, year: newYear }));
    };

    // Handler for navigating to the next month
    const handleNextMonth = () => {
        let newMonth = monthIndex + 1;
        let newYear = year;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        dispatch(calendarActions.setMonthYear({ month: newMonth, year: newYear }));
    };

    return (
        <div className="flex items-center justify-between border border-gray-200 p-4 mb-8">
            <div className="flex flex-1 items-center ">
                <Button variant="text" onClick={handlePrevMonth}>
                    <FontAwesomeIcon icon={assets.icon.leftChevron} className="text-button" size="xl" />
                </Button>
                <Button variant="text" onClick={() => {}} className="text-stroke w-1/8">
                    <h2 className="text-2xl font-bold">{currentDate.format('MMMM, YYYY')}</h2>
                </Button>
                <Button variant="text" onClick={handleNextMonth}>
                    <FontAwesomeIcon icon={assets.icon.rightChevron} className="text-button" size="xl" />
                </Button>
            </div>
            <div className="flex space-x-2">
                {MODES.map((m) => (
                    <Button
                        key={m}
                        onClick={() => dispatch(calendarActions.setViewMode(m))}
                        className={`px-3 py-1 rounded-xl text-[#003861] ${viewMode === m ? 'bg-button' : 'bg-gray-100'}
                        `}
                    >
                        <p className={viewMode === m ? 'font-bold' : ''}>{m.charAt(0).toUpperCase() + m.slice(1)}</p>
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default CalendarHeader;
