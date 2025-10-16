import { format } from 'date-fns';
import { APP_STANDARD_DATE_FORMAT } from '../constants/common';
import dayjs from 'dayjs';

/**
 * Utility functions for handling dates, time formatting, and color processing
 * used by the calendar, timeline, and task components of the application.
 *
 * Dependencies:
 * - dayjs: For time manipulation
 * - date-fns: For consistent date formatting
 */

/**
 * Generate a 5x7 matrix of Day.js objects representing the days of a month.
 * @param {number} [month=dayjs().month()] - Target month (0-based)
 * @param {number} [year=dayjs().year()] - Target year
 * @returns {Array<Array<dayjs.Dayjs>>} Matrix of weeks and days
 */
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

/**
 * Generate a list of days representing a week based on a given date and offset.
 * @param {dayjs.Dayjs} [baseDate=dayjs()] - Base date
 * @param {number} [weekOffset=0] - Week offset relative to current week
 * @returns {Array<dayjs.Dayjs>} Array of 7 days representing the week
 */
const getWeek = (baseDate = dayjs(), weekOffset = 0) => {
    let startOfWeek = dayjs(baseDate).add(weekOffset, 'week').startOf('week');

    startOfWeek = startOfWeek.add(1, 'day');

    const weekDays = new Array(7).fill(null).map((_, idx) => startOfWeek.add(idx, 'day'));

    return weekDays;
};

/**
 * Return CSS class for highlighting the current day.
 */
function getCurrentDayClass(day) {
    return day.format('DD-MM-YY') === dayjs().format('DD-MM-YY') ? 'bg-button text-white rounded-full' : '';
}

/**
 * Return CSS class if a given day matches the selected day.
 */
function isDaySelected(daySelected, day) {
    return daySelected === day.format('DD-MM-YY')
        ? 'rounded-full size-8 flex items-center justify-center border border-button'
        : '';
}

/** Format a date using the application’s standard format. */
const formatDate = (date) => {
    return format(date, APP_STANDARD_DATE_FORMAT);
};

/**
 * Format a JavaScript Date object into a readable date-time string.
 * @param {Date} date
 * @returns {string} e.g. "12-Oct-2025, 09:45AM"
 */
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

/** Check if two dates represent the same calendar day. */
const isSameDay = (date1, date2) => {
    return format(date1, APP_STANDARD_DATE_FORMAT) === format(date2, APP_STANDARD_DATE_FORMAT);
};

/**
 * Calculate duration in minutes between two timestamps.
 * Accounts for events that span across midnight.
 */
function getDurationMinutes(startTime, endTime) {
    const start = dayjs(startTime * 1000);
    const end = dayjs(endTime * 1000);

    let duration = end.diff(start, 'minutes');
    if (duration <= 0) {
        duration = end.add(1, 'day').diff(start, 'minutes');
    }

    return Math.max(duration, 1);
}

/** Get the number of minutes since start of the day from a timestamp. */
const getStartMinutes = (ts) => {
    const date = new Date(ts * 1000);
    return date.getHours() * 60 + date.getMinutes();
};

/**
 * Mix a color with white to produce a lighter variant.
 * @param {string} hex - Hex color code
 * @param {number} whiteRatio - Mixing ratio (0–1)
 * @returns {string} Lighter hex color
 */
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

/** Generate a pair of light/dark background colors for consistent UI theming. */
const setBackgroundColor = (color) => {
    const lightColor = mixWithWhite(color, 0.8);

    return {
        darkColor: color,
        lightColor: lightColor,
    };
};

/** Return a random color from a predefined palette. */
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

/** Convert any date or timestamp into the start of its day (00:00). */
const convertToStartOfDay = (d) => dayjs(d).startOf('day');

/** Calculate index of a given day relative to a timeline’s starting date. */
const dayIndexFrom = (ts, timelineStart) => convertToStartOfDay(ts).diff(convertToStartOfDay(timelineStart), 'day');

/** Return minutes elapsed within the current day from a timestamp. */
const minutesIntoDay = (ts) => {
    const d = dayjs(ts);
    return d.hour() * 60 + d.minute();
};

export {
    formatDate,
    isSameDay,
    setBackgroundColor,
    getMonth,
    getWeek,
    getCurrentDayClass,
    isDaySelected,
    formatDateTime,
    randomColor,
    getDurationMinutes,
    getStartMinutes,
    convertToStartOfDay,
    dayIndexFrom,
    minutesIntoDay,
};
