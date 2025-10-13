import { format } from 'date-fns';
import { APP_STANDARD_DATE_FORMAT } from '../constants/common';
import dayjs from 'dayjs';

const getMonth = (month = dayjs().month(), year = dayjs().year()) => {
    month = Math.floor(month);
    year = Math.floor(year);
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfTheMonth;
    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });
    return daysMatrix;
};

const getWeek = (baseDate = dayjs(), weekOffset = 0) => {
    let startOfWeek = dayjs(baseDate).add(weekOffset, 'week').startOf('week');

    startOfWeek = startOfWeek.add(1, 'day');

    const weekDays = new Array(7).fill(null).map((_, idx) => startOfWeek.add(idx, 'day'));

    return weekDays;
};

function getCurrentDayClass(day) {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ? 'bg-button text-white rounded-full' : '';
}

function isDaySelected(daySelected, day) {
    return daySelected === day.format('DD-MM-YY')
        ? 'rounded-full size-8 flex items-center justify-center border border-button'
        : '';
}

const formatDate = (date) => {
    return format(date, APP_STANDARD_DATE_FORMAT);
};

const formatDateTime = (date) => {
    if (!date) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // Sep
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = `${hours}:${minutes}${ampm}`;

    return `${day}-${month}-${year}, ${strTime}`;
};

const isSameDay = (date1, date2) => {
    return format(date1, APP_STANDARD_DATE_FORMAT) === format(date2, APP_STANDARD_DATE_FORMAT);
};

const stringToTimeStamp = (dateString) => {
    const date = new Date(dateString);
    return Math.floor(date.getTime());
};

const toStartOfDay = (ts) => {
    const date = new Date(ts);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
};

function getStartHour(time) {
    return dayjs(time * 1000).hour();
}

function getDurationMinutes(startTime, endTime) {
    const start = dayjs(startTime * 1000);
    const end = dayjs(endTime * 1000);

    let duration = end.diff(start, 'minutes');
    if (duration <= 0) {
        duration = end.add(1, 'day').diff(start, 'minutes');
    }

    return Math.max(duration, 1);
}

const getStartMinutes = (ts) => {
    const date = new Date(ts * 1000);
    return date.getHours() * 60 + date.getMinutes();
};

function mixWithWhite(hex, whiteRatio) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    const newR = Math.round(r * (1 - whiteRatio) + 255 * whiteRatio);
    const newG = Math.round(g * (1 - whiteRatio) + 255 * whiteRatio);
    const newB = Math.round(b * (1 - whiteRatio) + 255 * whiteRatio);

    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG)
        .toString(16)
        .padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
}

const setBackgroundColor = (color) => {
    const lightColor = mixWithWhite(color, 0.8);

    return {
        darkColor: color,
        lightColor: lightColor,
    };
};

const randomColor = () => {
    const colors = [
        '#FF0000', // red
        '#0000FF', // blue
        '#008000', // green
        '#FFFF00', // yellow
        '#FFA500', // orange
        '#800080', // purple
        '#FFC0CB', // pink
        '#A52A2A', // brown
        '#000000', // black
        '#FFFFFF', // white
        '#808080', // gray
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const convertToStartOfDay = (d) => dayjs(d).startOf('day');
const dayIndexFrom = (ts, timelineStart) => convertToStartOfDay(ts).diff(convertToStartOfDay(timelineStart), 'day');
const minutesIntoDay = (ts) => {
    const d = dayjs(ts);
    return d.hour() * 60 + d.minute();
};

export {
    formatDate,
    isSameDay,
    setBackgroundColor,
    stringToTimeStamp,
    toStartOfDay,
    getMonth,
    getWeek,
    getCurrentDayClass,
    isDaySelected,
    getStartHour,
    formatDateTime,
    randomColor,
    getDurationMinutes,
    getStartMinutes,
    convertToStartOfDay,
    dayIndexFrom,
    minutesIntoDay,
};
