import { useDispatch, useSelector } from 'react-redux';
import assets from '../../../../constants/icon';
import SidebarBtn from './SidebarBtn';
import { dialogActions } from '../../../../store/slices/DialogSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { colors } from '../../../../constants/color';

function Sidebar() {
    const dispatch = useDispatch();
    const isOpenSetting = useSelector((state) => state.dialog.openSetting);
    const isOpenNotification = useSelector((state) => state.dialog.openNotification);
    const sidebarState = useSelector((state) => state.sideBar.currentTab);

    const handleSidebarClick = (path) => {
        dispatch(dialogActions.closeAllDialogs());
        dispatch({ type: 'sideBar/setCurrentTab', payload: path });
    };

    return (
        <aside className="w-1/5 bg-primary py-9 px-7">
            <div className="flex items-center">
                <img src={assets.image.userTemp} alt="" className="w-14 h-14 mr-3" />
                <h4 className="text-headline font-medium text-3xl">User</h4>
            </div>
            <div className="my-10">
                <SidebarBtn
                    icon={assets.icon.notification}
                    label="Notification"
                    isActive={isOpenNotification}
                    onClick={() => dispatch(dialogActions.toggleNotification())}
                />
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
                        to="/my-task"
                        isActive={sidebarState === '/my-task'}
                        onClick={() => handleSidebarClick('/my-task')}
                    />
                    <SidebarBtn
                        icon={assets.icon.calendar}
                        label="Calendar"
                        to="/calendar"
                        isActive={sidebarState === '/calendar'}
                        onClick={() => handleSidebarClick('/calendar')}
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center mb-2">
                    <h5 className="text-headline font-medium mr-2">Your Projects</h5>
                    <FontAwesomeIcon icon={assets.icon.dropdown} color={colors.button} />
                </div>
                {/* Team 1 */}
                <div className="mb-2">
                    <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon={assets.icon.hashtag} className="mr-3" color={colors.button} />
                        <p className="text-main text-2xl">Team 1</p>
                        <FontAwesomeIcon icon={assets.icon.dropdown} className="ml-3" color={colors.button} />
                    </div>
                    <div className="pl-7">
                        <div className="pl-4 border-l-2 border-black/20">
                            <SidebarBtn
                                icon={assets.icon.chat}
                                label="Chat"
                                to="/chat"
                                isActive={sidebarState === '/chat'}
                                onClick={() => handleSidebarClick('/chat')}
                            />
                            <SidebarBtn
                                icon={assets.icon.group}
                                label="Task board"
                                to="/task-board"
                                isActive={sidebarState === '/task-board'}
                                onClick={() => handleSidebarClick('/task-board')}
                            />
                        </div>
                    </div>
                </div>

                {/* Team 2 */}
                <div className="mb-2">
                    <div className="flex items-center mb-2">
                        <FontAwesomeIcon icon={assets.icon.hashtag} className="mr-3" color={colors.button} />
                        <p className="text-main text-2xl">Team 2</p>
                        <FontAwesomeIcon icon={assets.icon.rightChevron} className="ml-3" color={colors.button} />
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
