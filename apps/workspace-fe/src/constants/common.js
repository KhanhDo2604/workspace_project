const APP_STANDARD_DATE_FORMAT = 'dd-MMM-yyyy'; // Standardized date display format (e.g., 12-Oct-2025)
const DAYOFWEEK = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]; /** Short weekday abbreviations used throughout the UI */
const MODES = [
    'day',
    'week',
    'month',
]; /** Available calendar modes (used for switching between daily, weekly, and monthly views) */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Generate a human-readable list of hours in 12-hour format.
 * Used by the timeline view and calendar time selectors.
 */
const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour.toString().padStart(2, '0')} ${period}`;
});

export { APP_STANDARD_DATE_FORMAT, DAYOFWEEK, MODES, HOURS, MONTHS };
