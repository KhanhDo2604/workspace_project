import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { typeColorMap } from '../../constants/color';
import assets from '../../constants/icon';

function TaskCard({ id, title, assignees, types }) {
    return (
        <div className="bg-headline p-6 rounded-lg shadow-sm w-full">
            <p className="text-gray-500 text-base">{id}</p>

            <h1 className="text-xl font-semibold line-clamp-1 text-ellipsis overflow-hidden mt-4">{title}</h1>

            <div className="my-4 gap-2 flex flex-wrap">
                {types.map((type, index) => (
                    <span
                        key={index}
                        className={`px-2 py-1 text-base rounded-full font-bold ${
                            typeColorMap[type] || 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        {type}
                    </span>
                ))}
            </div>

            <div className="flex justify-between">
                {assignees && assignees.length > 0 && (
                    <div>
                        {assignees.map((assignee, index) => (
                            <img
                                key={index}
                                src={assignee.avatar || assets.image.userTemp}
                                alt={assignee.name}
                                className="w-8 h-8 rounded-full inline-block mr-2"
                            />
                        ))}
                    </div>
                )}

                <div className="flex gap-1 items-center justify-center">
                    <FontAwesomeIcon icon={assets.icon.comment} />
                    <p className="text-base font-semibold">3</p>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;
