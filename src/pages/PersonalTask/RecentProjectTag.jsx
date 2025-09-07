import Button from '../../components/Button';

function RecentProjectTag({ icon, color, project }) {
    return (
        <Button variant="text">
            <div className="flex rounded-lg shadow-sm w-full h-fit bg-white">
                <div className="relative">
                    <div className="grid grid-cols-2 w-16 h-full">
                        <div className={`bg-[${color}] h-full rounded-s-lg`}></div>
                        <div className="bg-white h-full"></div>
                    </div>
                    <div className={`absolute top-4 left-4 w-16 h-full`}>
                        <img src={icon} alt="icon" className="object-cover w-8 h-8" />
                    </div>
                </div>
                <div className="py-4 pr-4 flex flex-col items-start">
                    <div className="mb-9 flex flex-col items-start">
                        <h3 className="font-semibold text-stroke">{project.number}</h3>
                        <p className="text-sm text-gray-500">{project.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{project.members.length} members</p>
                </div>
            </div>
        </Button>
    );
}

export default RecentProjectTag;
