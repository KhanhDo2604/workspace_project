function SidebarBtn({ icon, label, onClick }) {
    return (
        <button
            className="flex items-center mb-2 py-2 px-2 text-main hover:bg-secondary hover:text-headline hover:rounded-lg w-full"
            onClick={onClick}
        >
            <img src={icon} alt="" className="mr-3 w-8 h-8" />
            <p className="text-2xl">{label}</p>
        </button>
    );
}

export default SidebarBtn;
