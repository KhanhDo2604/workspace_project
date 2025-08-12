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
    const startOfWeek = dayjs(baseDate).add(weekOffset, 'week').startOf('week'); //sunday as default

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

function getStartHour(event) {
    return dayjs(event.date * 1000).hour();
}

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

const randomColor = () => {
    const darkColor =
        '#' +
        Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0');

    const lightColor = mixWithWhite(darkColor, 0.8);

    return {
        darkColor: darkColor,
        lightColor: lightColor,
    };
};

export {
    formatDate,
    isSameDay,
    randomColor,
    stringToTimeStamp,
    toStartOfDay,
    getMonth,
    getWeek,
    getCurrentDayClass,
    isDaySelected,
    getStartHour,
};
