import { useEffect } from 'react';
import AddScheduleDialog from '../../../pages/Chat/AddScheduleDialog';
import { dialogActions } from '../../../store/slices/DialogSlice';
import NotificationDialog from '../../Notification';
import SettingDialog from '../../SettingDialog';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

function DefaultLayout({ children }) {
    const isOpenSetting = useSelector((state) => state.dialog.openSetting);
    const isOpenNotification = useSelector((state) => state.dialog.openNotification);
    const isOpenAddScheduleDialog = useSelector((state) => state.dialog.openAddScheduleDialog);
    const message = useSelector((state) => state.auth.message);

    const dispatch = useDispatch();

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
        return;
    }, [message]);

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar />
                <Toaster />
                <div className="size-full relative overflow-hidden">
                    {children}

                    {(isOpenSetting || isOpenNotification || isOpenAddScheduleDialog) && (
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

                    {isOpenAddScheduleDialog && (
                        <div className="absolute inset-0 z-50">
                            <div className="absolute inset-0 bg-black/30" />

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                                <AddScheduleDialog />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
