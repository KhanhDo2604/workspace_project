import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ column, tasks }) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });
    let colorClass = '';

    if (tasks.color === 'blue') colorClass = 'bg-blue-300 text-blue-950';
    else if (tasks.color === 'red') colorClass = 'bg-red-200 text-red-950';
    else if (tasks.color === 'orange') colorClass = 'bg-yellow-100 text-yellow-950';
    else if (tasks.color === 'green') colorClass = 'bg-green-200 text-green-950';

    return (
        <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center mb-2">
                <div className={`rounded-full ${colorClass} size-9 text-lg mr-2 flex justify-center items-center`}>
                    <p className="leading-0">{tasks.filter((task) => task.status === column.id).length}</p>
                </div>
                <h2 className="text-xl font-bold">{column.title}</h2>
            </div>
            <div ref={setNodeRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 p-1">
                {tasks
                    .filter((task) => task.status === column.id)
                    .map((e) => (
                        <TaskCard key={e.id} task={e} />
                    ))}
            </div>
        </div>
    );
}

export default Column;
