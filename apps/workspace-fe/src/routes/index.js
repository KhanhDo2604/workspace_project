import MeetingPage from '../pages/Meeting';
import PersonalTaskPage from '../pages/PersonalTask';
import SchedulePage from '../pages/Schedule';
import TaskBoardPage from '../pages/TaskBoard';
import ChatScreen from '../pages/Chat';
import TimelinePage from '../pages/TaskBoard/TimeLinePage';
import LoadingPage from '../pages/LoadingPage';

const privateRoutes = [
    { path: '/my-space/:userId', component: PersonalTaskPage },
    { path: '/calendar/:userId', component: SchedulePage },
    { path: '/task-board/:projectId', component: TaskBoardPage },
    { path: '/chat/:projectId/:userId', component: ChatScreen },
    { path: '/task-board/time-line/:projectId', component: TimelinePage },
    { path: '/meeting/:projectId', component: MeetingPage, thread: 'none-layout' },
    { path: '/', component: LoadingPage, thread: 'none-layout' },
];

export default privateRoutes;
