import google from '../assets/icons/google.svg';
import lock from '../assets/icons/lock.svg';
import userTemp from '../assets/icons/user_temp.svg';
import meetingEnd from '../assets/icons/meeting_end.svg';
import whiteBoard from '../assets/icons/whiteboard.svg';

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
    faChevronLeft,
    faEyeSlash,
    faEye,
    faMicrophone,
    faMicrophoneSlash,
    faVideo,
    faVideoSlash,
    faEllipsisVertical,
    faPaperPlane,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { faJira, faTrello } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faClock, faCalendarDays, faCommentDots } from '@fortawesome/free-regular-svg-icons';

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
    leftChevron: faChevronLeft,
    google: google,
    email: faEnvelope,
    lock: lock,
    eyeOff: faEyeSlash,
    eyeOpen: faEye,
    clock: faClock,
    mic: faMicrophone,
    micOff: faMicrophoneSlash,
    video: faVideo,
    videoOff: faVideoSlash,
    more: faEllipsisVertical,
    send: faPaperPlane,
    meetingEnd: meetingEnd,
    whiteBoard: whiteBoard,
    jira: faJira,
    trello: faTrello,
    calendarOutline: faCalendarDays,
    comment: faCommentDots,
    add: faPlus,
};

const image = {
    userTemp: userTemp,
    login_bg: login_bg,
};

export default { icon, image };
