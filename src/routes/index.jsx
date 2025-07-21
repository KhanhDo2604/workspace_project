import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import MeetingPage from "../pages/Meeting";
import PersonalTaskPage from "../pages/PersonalTask";
import SchedulePage from "../pages/Schedule";
import TaskBoardPage from "../pages/TaskBoard";

const privateRoutes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/meeting", component: MeetingPage },
  { path: "/my-task", component: PersonalTaskPage },
  { path: "/calendar", component: SchedulePage },
  { path: "/task-board", component: TaskBoardPage },
];

export default privateRoutes;
