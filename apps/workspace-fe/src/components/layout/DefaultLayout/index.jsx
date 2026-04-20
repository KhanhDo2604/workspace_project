import { useEffect } from 'react';
import { dialogActions } from '../../../store/slices/DialogSlice';
import NotificationDialog from '../../Notification';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

function DefaultLayout({ children }) {
    const isOpenSetting = useSelector((state) => state.dialog.openSetting);
    const isOpenNotification = useSelector((state) => state.dialog.openNotification);
    const message = useSelector((state) => state.auth.message);

    const dispatch = useDispatch();

    // Effect: Display success toast
    // when authentication or actions produce a message
    useEffect(() => {
        if (message) {
            toast.success(message);
        }
        return;
    }, [message]);

    return (
        <div className="flex h-screen">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Global Toast Notifications */}
            <Toaster />

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-y-auto overflow-x-hidden min-w-0" data-testid="scrollable-content">
                {children}

                {(isOpenSetting || isOpenNotification) && (
                    <div
                        onClick={() => dispatch(dialogActions.closeAllDialogs())}
                        className="absolute top-0 left-0 size-full bg-black/20 z-40"
                    />
                )}

                {/* {isOpenSetting && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-1/2">
                            <SettingDialog />
                        </div>
                    )} */}

                {/* Notification Dialog */}
                {isOpenNotification && (
                    <div className="absolute top-32 left-4 z-50">
                        <NotificationDialog />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DefaultLayout;
