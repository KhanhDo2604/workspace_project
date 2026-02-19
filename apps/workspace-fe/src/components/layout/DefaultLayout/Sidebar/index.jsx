import { useDispatch, useSelector } from 'react-redux';
import assets from '../../../../constants/icon';
import SidebarBtn from './SidebarBtn';
import { dialogActions } from '../../../../store/slices/DialogSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '../../../../constants/color';
import { logoutUser } from '../../../../store/slices/AuthSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SettingDialog from '../../../SettingDialog';

function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux States & Local Storage
    const sidebarState = useSelector((state) => state.sideBar.currentTab);
    const userId = localStorage.getItem('user_id');
    const projects = useSelector((state) => state.project.projects);
    const user = useSelector((state) => state.auth.user);

    // Track which project sections are expanded
    const [openProjects, setOpenProjects] = useState({});

    /**
     * Handles sidebar navigation clicks:
     * - Closes any open dialogs
     * - Updates sidebar state
     * - Optionally executes custom callback (e.g., navigation)
     */
    const handleSidebarClick = async (path, onClick) => {
        dispatch(dialogActions.closeAllDialogs());
        dispatch({ type: 'sideBar/setCurrentTab', payload: path });
        if (onClick) await onClick();
    };

    /**
     * Signs the user out and redirects to login page
     */
    const handleSignOut = () => {
        dispatch(logoutUser());
        navigate(`/login`, { replace: true });
    };

    /**
     * Toggles expansion state for a specific project
     */
    const toggleProject = (projectId) => {
        setOpenProjects((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };

    return (
        <aside className="w-1/5 bg-primary py-9 px-7 flex flex-col h-screen">
            {/* User Information */}
            <div className="flex items-center">
                <Avatar className="w-21 h-21 mr-3 rounded-full object-cover border border-gray-300">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h4 className="text-headline font-medium text-3xl overflow-hidden text-ellipsis whitespace-nowrap">
                    {user?.name}
                </h4>
            </div>

            {/* Settings Dialog */}
            <div className="my-10 w-full">
                <SettingDialog triggerBtn={<SidebarBtn icon={assets.icon.setting} label="Settings" />} />
            </div>

            {/* Workspace Section */}
            <div className="mb-10">
                <h5 className="text-headline font-medium overflow-hidden text-ellipsis whitespace-nowrap">Workspace</h5>
                <div className="mb-2">
                    <SidebarBtn
                        icon={assets.icon.myTask}
                        label="My space"
                        to={`/my-space/${userId}`}
                        isActive={sidebarState.includes(`/my-space`)}
                        onClick={() => handleSidebarClick(`/my-space/${userId}`)}
                    />
                    <SidebarBtn
                        icon={assets.icon.calendar}
                        label="Calendar"
                        to={`/calendar/${userId}`}
                        isActive={sidebarState.includes(`/calendar`)}
                        onClick={() => handleSidebarClick(`/calendar/${userId}`)}
                    />
                </div>
            </div>

            {/* Projects Section */}
            <div className="flex-1 overflow-y-auto mb-10">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-headline font-medium mr-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        Your Projects
                    </h5>
                    <FontAwesomeIcon icon={assets.icon.progress} color={colors.button} />
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
                                        className="mr-3 shrink-0"
                                        color={colors.button}
                                    />
                                    <p className="text-main text-2xl truncate overflow-hidden text-ellipsis whitespace-nowrap">
                                        {project.title}
                                    </p>
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

            {/* Sign Out Button */}
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
