import LoginPage from '../pages/Login';
import MeetingPage from '../pages/Meeting';
import PersonalTaskPage from '../pages/PersonalTask';
import SchedulePage from '../pages/Schedule';
import TaskBoardPage from '../pages/TaskBoard';
import SignupPage from '../pages/Register';
import ForgotPasswordPage from '../pages/ForgotPassword';
import SetPasswordPage from '../pages/SetPassword';
import ChatScreen from '../pages/Chat';
import TimelinePage from '../pages/TaskBoard/TimeLinePage';

const privateRoutes = [
    { path: '/my-task/:userId', component: PersonalTaskPage },
    { path: '/calendar/:userId', component: SchedulePage },
    { path: '/task-board', component: TaskBoardPage },
    { path: '/chat/:userId', component: ChatScreen },
    { path: '/task-board/time-line', component: TimelinePage },
    { path: '/login', component: LoginPage, thread: 'auth' },
    { path: '/signup', component: SignupPage, thread: 'auth' },
    { path: '/forgot-password', component: ForgotPasswordPage, thread: 'auth' },
    { path: '/set-new-password', component: SetPasswordPage, thread: 'auth' },
    { path: '/meeting/:projectId', component: MeetingPage, thread: 'none-layout' },
];

export default privateRoutes;
