import google from '../assets/icons/google.svg';
import lock from '../assets/icons/lock.svg';
import userTemp from '../assets/icons/user_temp.svg';

import login_bg from '../assets/images/login_bg.svg';

import {
    faMessage,
    faBell,
    faGear,
    faCalendarWeek,
    faChevronDown,
    faUserGroup,
    faHashtag,
    faClipboardCheck,
    faChevronRight,
    faEyeSlash,
    faEye,
} from '@fortawesome/free-solid-svg-icons';
import { faEnvelope, faClock } from '@fortawesome/free-regular-svg-icons';

const icon = {
    chat: faMessage,
    notification: faBell,
    setting: faGear,
    calendar: faCalendarWeek,
    dropdown: faChevronDown,
    group: faUserGroup,
    hashtag: faHashtag,
    myTask: faClipboardCheck,
    rightChevron: faChevronRight,
    google: google,
    email: faEnvelope,
    lock: lock,
    eyeOff: faEyeSlash,
    eyeOpen: faEye,
    clock: faClock,
};

const image = {
    userTemp: userTemp,
    login_bg: login_bg,
};

export default { icon, image };
