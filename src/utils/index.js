import { format } from 'date-fns';
import { APP_STANDARD_DATE_FORMAT } from '../constants/common';

const formatDate = (date) => {
    return format(date, APP_STANDARD_DATE_FORMAT);
};

const isSameDay = (date1, date2) => {
    return format(date1, APP_STANDARD_DATE_FORMAT) === format(date2, APP_STANDARD_DATE_FORMAT);
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

export { formatDate, isSameDay, randomColor };
