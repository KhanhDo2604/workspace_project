import { useDraggable } from '@dnd-kit/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { typeColorMap } from '../../constants/color';
import assets from '../../constants/icon';
import UpdateTaskModal from '../../components/UpdateTaskModal';
import { Button } from '../../components/ui/button';

/**
 * Displays a draggable card representing a task item in the timeline or Kanban view.
 * Each card shows task metadata such as title, description, tags, and assignees.
 * The card can be dragged across columns using the @dnd-kit library.
 */
function TaskCard({ task }) {
    // Enable drag functionality using dnd-kit
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    // Apply transformation during drag to move the card visually
    const style = transform
        ? {
              transform: `translate(${transform.x}px, ${transform.y}px)`,
          }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="cursor-grab bg-headline p-6 rounded-lg shadow-sm w-full hover:shadow-md"
        >
            {/* Top section: Task ID and detail button */}
            <div className="flex justify-between items-center">
                <p className="text-gray-500 text-base">{task.id}</p>
                <UpdateTaskModal
                    currentTask={task}
                    triggerBtn={
                        <Button variant={'icon'}>
                            <FontAwesomeIcon icon={assets.icon.info} />
                        </Button>
                    }
                />
            </div>

            <h1 className="text-xl font-semibold line-clamp-1 text-ellipsis overflow-hidden mt-4">{task.title}</h1>

            <p className="text-gray-500 text-base">{task.description}</p>

            {/* Tag list (task types) */}
            <div className="my-4 gap-2 flex flex-wrap">
                {task.types.map((type, index) => (
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

            {/* Assignees section */}
            <div className="flex justify-between">
                {task.assignees && task.assignees.length > 0 && (
                    <div>
                        {task.assignees.map((assignee, index) => (
                            <img
                                key={index}
                                src={assignee.avatar || assets.image.userTemp}
                                alt={assignee.name}
                                className="w-8 h-8 rounded-full inline-block mr-2"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskCard;
