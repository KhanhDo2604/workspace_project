import { Link } from 'react-router-dom';

function SidebarBtn({ icon, label, endIcon, to, onClick }) {
    let Element = to ? Link : 'button';
    return (
        <Element
            className="flex items-center justify-between mb-2 py-2 px-2 text-2xl text-main hover:bg-secondary hover:text-headline hover:rounded-lg w-full"
            to={to}
            onClick={onClick}
        >
            <div className="flex items-center">
                <img src={icon} alt="" className="mr-3 w-8 h-8" />
                <p className="text-2xl">{label}</p>
            </div>
            {endIcon !== undefined ? (
                <div className="ml-auto">
                    <img src={endIcon} alt="" className="w-8 h-8" />
                </div>
            ) : null}
        </Element>
    );
}

export default SidebarBtn;
