import assets from '../../../constants/icon';

function AuthenticationLayout({ children }) {
    return (
        <div className="grid grid-cols-2 bg-secondary">
            {/* Left side */}
            <div className="col-span-1">{children}</div>
            {/* Right side */}
            <div className="col-span-1 flex items-center justify-center">
                <img src={assets.image.login_bg} alt="login background" className="object-cover" />
            </div>
        </div>
    );
}

export default AuthenticationLayout;
