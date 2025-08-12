import { useEffect, useState } from 'react';

import { getMonth, getWeek } from '../../utils';
import { useSelector } from 'react-redux';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import { MODES } from '../../constants/common';
import WeekView from './WeekView';
import dayjs from 'dayjs';
import DayView from './DayView';

function SchedulePage() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const [currentWeek, setCurrentWeek] = useState(getWeek());
    const [currentDay, setCurrentDay] = useState();

    const monthIndex = useSelector((state) => state.calendar.monthIndex);
    const year = useSelector((state) => state.calendar.year);
    const viewMode = useSelector((state) => state.calendar.viewMode);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex, year));
        setCurrentWeek(getWeek());
        setCurrentDay(dayjs());
    }, [monthIndex, year]);

    return (
        <>
            <div className="h-full flex flex-col">
                <CalendarHeader />
                <div className="flex flex-1 px-4 pb-4">
                    {viewMode === MODES[2] && <MonthView month={currentMonth} />}
                    {viewMode === MODES[1] && <WeekView week={currentWeek} />}
                    {viewMode === MODES[0] && <DayView day={currentDay} />}
                </div>
            </div>
        </>
    );
}

export default SchedulePage;
