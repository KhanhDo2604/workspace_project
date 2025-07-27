import NotificationDialog from '../../Notification';
import SettingDialog from '../../SettingDialog';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

function DefaultLayout({ children }) {
    const isOpenSetting = useSelector((state) => state.dialog.openSetting);
    const isOpenNotification = useSelector((state) => state.dialog.openNotification);

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar />
                <div className="size-full relative">
                    {children}
                    <div
                        className={`absolute left-1/2 top-1/2 w-full h-full bg-black/20 ${
                            isOpenSetting ? 'flex' : 'hidden'
                        } -translate-x-1/2 -translate-y-1/2 justify-center items-center z-50`}
                    >
                        {isOpenSetting && <SettingDialog />}
                    </div>
                    <div className={`absolute top-46 left-1 ${isOpenNotification ? 'block' : 'hidden'}`}>
                        {isOpenNotification && <NotificationDialog />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
