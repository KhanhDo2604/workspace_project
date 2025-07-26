import assets from '../../../../constants/icon';
import SidebarBtn from './SidebarBtn';

function Sidebar() {
    return (
        <aside className="w-1/5 bg-primary py-9 px-7">
            <div className="flex items-center">
                <img src={assets.image.userTemp} alt="" className="w-14 h-14 mr-3" />
                <h4 className="text-headline font-medium text-3xl">User</h4>
            </div>
            <div className="my-10">
                <SidebarBtn icon={assets.icon.notification} label="Notification" />
                <SidebarBtn icon={assets.icon.setting} label="Settings" />
            </div>

            <div className="mb-10">
                <h5 className="text-headline font-medium">Workspace</h5>
                <div className="mb-2">
                    <SidebarBtn icon={assets.icon.myTask} label="My tasks" />
                    <SidebarBtn icon={assets.icon.calendar} label="Calendar" />
                </div>
            </div>

            <div>
                <div className="flex items-center mb-2">
                    <h5 className="text-headline font-medium mr-2">Your Projects</h5>
                    <img src={assets.icon.dropdown} alt="" className="w-6 h-6" />
                </div>
                {/* Team 1 */}
                <div className="mb-2">
                    <div className="flex items-center mb-2">
                        <img src={assets.icon.hashtag} alt="" className="mr-3 w-8 h-8" />
                        <p className="text-main text-2xl">Team 1</p>
                        <img src={assets.icon.dropdown} alt="" className="ml-3 w-8 h-8" />
                    </div>
                    <div className="pl-7">
                        <div className="pl-4 border-l-2 border-black/20">
                            <SidebarBtn icon={assets.icon.chat} label="Chat" />
                            <SidebarBtn icon={assets.icon.group} label="Task board" />
                        </div>
                    </div>
                </div>

                {/* Team 2 */}
                <div className="mb-2">
                    <div className="flex items-center mb-2">
                        <img src={assets.icon.hashtag} alt="" className="mr-3 w-6 h-6" />
                        <p className="text-main text-2xl">Team 2</p>
                        <img src={assets.icon.rightChevron} alt="" className="ml-3 w-6 h-6" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
