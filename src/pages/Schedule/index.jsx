import { useEffect, useState } from 'react';

import CalendarContent from './CalendarContent';
import { getMonth } from '../../utils';
import { useSelector } from 'react-redux';
import CalendarHeader from './CalendarHeader';

function SchedulePage() {
    const [currentMonth, setCurrentMonth] = useState(getMonth());
    const monthIndex = useSelector((state) => state.calendar.monthIndex);
    const year = useSelector((state) => state.calendar.year);

    useEffect(() => {
        setCurrentMonth(getMonth(monthIndex, year));
    }, [monthIndex, year]);

    return (
        <>
            <div className="h-full flex flex-col">
                <CalendarHeader />
                <div className="flex flex-1 px-4 pb-4">
                    <CalendarContent month={currentMonth} />
                </div>
            </div>
        </>
    );
}

export default SchedulePage;
