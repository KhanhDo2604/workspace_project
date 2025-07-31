import { dialogActions } from '../../../store/slices/DialogSlice';
import NotificationDialog from '../../Notification';
import SettingDialog from '../../SettingDialog';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';

function DefaultLayout({ children }) {
    const isOpenSetting = useSelector((state) => state.dialog.openSetting);
    const isOpenNotification = useSelector((state) => state.dialog.openNotification);
    const dispatch = useDispatch();

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar />
                <div className="size-full relative">
                    {children}

                    {(isOpenSetting || isOpenNotification) && (
                        <div
                            onClick={() => dispatch(dialogActions.closeAllDialogs())}
                            className="absolute top-0 left-0 size-full bg-black/20 z-40"
                        />
                    )}

                    {isOpenSetting && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-1/2">
                            <SettingDialog />
                        </div>
                    )}

                    {isOpenNotification && (
                        <div className="absolute top-32 left-4 z-50">
                            <NotificationDialog />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
