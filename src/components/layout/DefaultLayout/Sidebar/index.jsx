import { useDispatch, useSelector } from 'react-redux';
import assets from '../../../../constants/icon';
import SidebarBtn from './SidebarBtn';
import { dialogActions } from '../../../../store/slices/DialogSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '../../../../constants/color';
import { logoutUser } from '../../../../store/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isOpenSetting = useSelector((state) => state.dialog.openSetting);
    // const isOpenNotification = useSelector((state) => state.dialog.openNotification);
    const sidebarState = useSelector((state) => state.sideBar.currentTab);
    const userId = localStorage.getItem('user_id');
    const projects = useSelector((state) => state.project.projects);
    const [openProjects, setOpenProjects] = useState({});

    const handleSidebarClick = async (path, onClick) => {
        dispatch(dialogActions.closeAllDialogs());
        dispatch({ type: 'sideBar/setCurrentTab', payload: path });
        if (onClick) await onClick();
    };

    const handleSignOut = () => {
        dispatch(logoutUser());
        navigate(`/login`, { replace: true });
    };

    const toggleProject = (projectId) => {
        setOpenProjects((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };

    return (
        <aside className="w-1/5 bg-primary py-9 px-7 flex flex-col h-screen">
            <div className="flex items-center">
                <img src={assets.image.userTemp} alt="" className="w-14 h-14 mr-3" />
                <h4 className="text-headline font-medium text-3xl">User</h4>
            </div>
            <div className="my-10">
                {/* <SidebarBtn
                    icon={assets.icon.notification}
                    label="Notification"
                    isActive={isOpenNotification}
                    onClick={() => dispatch(dialogActions.toggleNotification())}
                /> */}
                <SidebarBtn
                    icon={assets.icon.setting}
                    label="Settings"
                    isActive={isOpenSetting}
                    onClick={() => dispatch(dialogActions.toggleSetting())}
                />
            </div>

            <div className="mb-10">
                <h5 className="text-headline font-medium">Workspace</h5>
                <div className="mb-2">
                    <SidebarBtn
                        icon={assets.icon.myTask}
                        label="My tasks"
                        to={`/my-task/${userId}`}
                        isActive={sidebarState === `/my-task/${userId}`}
                        onClick={() => handleSidebarClick(`/my-task/${userId}`)}
                    />
                    <SidebarBtn
                        icon={assets.icon.calendar}
                        label="Calendar"
                        to={`/calendar/${userId}`}
                        isActive={sidebarState === `/calendar/${userId}`}
                        onClick={() => handleSidebarClick(`/calendar/${userId}`)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-10">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-headline font-medium mr-2">Your Projects</h5>
                    <FontAwesomeIcon icon={assets.icon.dropdown} color={colors.button} />
                </div>
                {projects.map((project) => {
                    const isOpen = openProjects[project.id] ?? false;

                    return (
                        <div key={project.id} className="mb-2">
                            <div
                                className="flex items-center mb-2 cursor-pointer select-none"
                                onClick={() => toggleProject(project.id)}
                            >
                                <div className="flex items-center flex-1 min-w-0">
                                    <FontAwesomeIcon
                                        icon={assets.icon.hashtag}
                                        className="mr-3 flex-shrink-0"
                                        color={colors.button}
                                    />
                                    <p className="text-main text-2xl truncate">{project.title}</p>
                                </div>
                                <FontAwesomeIcon
                                    icon={isOpen ? assets.icon.rightChevron : assets.icon.dropdown}
                                    className="ml-3"
                                    color={colors.button}
                                />
                            </div>

                            {isOpen && (
                                <div className="pl-7 transition-all duration-300">
                                    <div className="pl-4 border-l-2 border-black/20">
                                        <SidebarBtn
                                            icon={assets.icon.chat}
                                            label="Chat"
                                            to={`/chat/${project.id}/${userId}`}
                                            isActive={sidebarState === `/chat/${project.id}/${userId}`}
                                            onClick={() => {
                                                handleSidebarClick(`/chat/${project.id}/${userId}`);
                                                dispatch({ type: 'project/setCurrentProject', payload: project });
                                            }}
                                        />
                                        <SidebarBtn
                                            icon={assets.icon.group}
                                            label="Task board"
                                            to={`/task-board/${project.id}`}
                                            isActive={sidebarState === `/task-board/${project.id}`}
                                            onClick={() => {
                                                handleSidebarClick(`/task-board/${project.id}`);
                                                dispatch({ type: 'project/setCurrentProject', payload: project });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-auto">
                <SidebarBtn
                    icon={assets.icon.leftChevron}
                    label="Sign Out"
                    isActive={sidebarState === '/signout'}
                    onClick={() => handleSidebarClick('/signout', handleSignOut)}
                />
            </div>
        </aside>
    );
}

export default Sidebar;
