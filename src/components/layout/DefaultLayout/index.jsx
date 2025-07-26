import Sidebar from './Sidebar';

function DefaultLayout({ children }) {
    return (
        <div>
            <div className="flex h-screen">
                <Sidebar />
                <div className="size-full">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
