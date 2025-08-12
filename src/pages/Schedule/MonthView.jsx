import { DAYOFWEEK } from '../../constants/common';
import Day from './Day';

function MonthView({ month }) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="grid grid-cols-7">
                {DAYOFWEEK.flat().map((day, idx) => (
                    <div className="border border-gray-200 p-2" key={idx}>
                        <p className="text-lg font-bold">{day}</p>
                    </div>
                ))}
            </div>
            {/* Calendar Days */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5">
                {month.flat().map((day, idx) => (
                    <Day day={day} key={idx} />
                ))}
            </div>
        </div>
    );
}

export default MonthView;
