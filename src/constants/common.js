const APP_STANDARD_DATE_FORMAT = 'dd-MMM-yyyy';
const DAYOFWEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MODES = ['day', 'week', 'month'];

const HOURS = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour.toString().padStart(2, '0')} ${period}`;
});

export { APP_STANDARD_DATE_FORMAT, DAYOFWEEK, MODES, HOURS };
