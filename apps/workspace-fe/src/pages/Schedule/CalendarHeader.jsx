import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';

import assets from '../../constants/icon';
import Button from '../../components/Button';
import { MODES, MONTHS } from '../../constants/common';
import { calendarActions } from '../../store/slices/CalendarSlice';
import { useEffect, useRef, useState } from 'react';

function CalendarHeader() {
    const dispatch = useDispatch();
    const [showPicker, setShowPicker] = useState(false);
    const [pickerYear, setPickerYear] = useState(null);
    const pickerRef = useRef(null);

    // Redux States
    const monthIndex = useSelector((state) => state.calendar.monthIndex);
    const viewMode = useSelector((state) => state.calendar.viewMode);
    const year = useSelector((state) => state.calendar.year);
    const currentDate = dayjs().year(year).month(monthIndex);

    const handleOpenPicker = () => {
        setPickerYear(year);
        setShowPicker((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

    const handleSelectMonth = (month) => {
        dispatch(calendarActions.setMonthYear({ month, year: pickerYear }));
        setShowPicker(false);
    };

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

                {/* Calendar picker button + popover */}
                <div className="relative mx-3" ref={pickerRef}>
                    <Button variant="text" onClick={handleOpenPicker} className="text-stroke">
                        <h2 className="text-2xl font-bold whitespace-nowrap">{currentDate.format('MMMM, YYYY')}</h2>
                    </Button>

                    {showPicker && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 w-64">
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    onClick={() => setPickerYear((y) => y - 1)}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <FontAwesomeIcon icon={assets.icon.leftChevron} />
                                </button>
                                <span className="font-semibold text-[#003861]">{pickerYear}</span>
                                <button
                                    onClick={() => setPickerYear((y) => y + 1)}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <FontAwesomeIcon icon={assets.icon.rightChevron} />
                                </button>
                            </div>

                            {/* Grid 12 tháng */}
                            <div className="grid grid-cols-3 gap-2">
                                {MONTHS.map((m, i) => {
                                    const isSelected = i === monthIndex && pickerYear === year;
                                    return (
                                        <button
                                            key={m}
                                            onClick={() => handleSelectMonth(i)}
                                            className={`py-1.5 rounded-lg text-sm font-medium transition-colors
                                                ${
                                                    isSelected
                                                        ? 'bg-[#003861] text-white'
                                                        : 'hover:bg-gray-100 text-[#003861]'
                                                }`}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

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
