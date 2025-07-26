import { Link } from 'react-router-dom';

function SidebarBtn({ icon, label, to, onClick }) {
    return (
        <Link
            className="flex items-center mb-2 py-2 px-2 text-2xl text-main hover:bg-secondary hover:text-headline hover:rounded-lg w-full"
            to={to}
            onClick={onClick}
        >
            <img src={icon} alt="" className="mr-3 w-8 h-8" />
            <p className="text-2x">{label}</p>
        </Link>
    );
}

export default SidebarBtn;
