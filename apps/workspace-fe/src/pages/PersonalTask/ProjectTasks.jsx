import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import assets from '../../constants/icon';
import { formatDateTime } from '../../utils';

function ProjectTasks({ teamName, taskCount, endDate, tasks }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const typeColorMap = {
        Design: 'bg-yellow-200 text-yellow-800',
        Research: 'bg-pink-200 text-pink-800',
        'Q&A': 'bg-blue-200 text-blue-800',
        Development: 'bg-green-200 text-green-800',
        Development2: 'bg-purple-200 text-purple-800',
        Development3: 'bg-red-200 text-red-800',
    };

    return (
        <div className="bg-white rounded-lg mb-3" data-testid="project-card">
            {/* Header */}
            <div
                className={`flex justify-between items-center cursor-pointer px-5 py-4 gap-4 ${
                    isExpanded ? 'border-b border-gray-200' : ''
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FontAwesomeIcon
                        icon={isExpanded ? assets.icon.upChevron : assets.icon.dropdown}
                        className="shrink-0 text-gray-500"
                    />
                    <span className="font-semibold text-base truncate">#{teamName} tasks</span>
                    <span className="text-sm font-normal text-gray-400 shrink-0">
                        ({taskCount} task{taskCount !== 1 ? 's' : ''})
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-sm text-gray-500">
                    <FontAwesomeIcon icon={assets.icon.clock} className="shrink-0" />
                    <span className="font-semibold text-gray-700">End date:</span>
                    <span>{endDate ?? '—'}</span>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="px-5 py-4">
                    {/* Header row */}
                    <div className="grid grid-cols-6 text-xs font-semibold text-gray-400 uppercase tracking-wide pb-2 border-b border-gray-100">
                        <span className="col-span-2">Task name</span>
                        <span>Type</span>
                        <span>Assignee</span>
                        <span>Start date</span>
                        <span>Due date</span>
                    </div>

                    {/* Task rows */}
                    {tasks.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">No tasks yet</p>
                    ) : (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                className="grid grid-cols-6 text-sm items-start py-3 border-b border-gray-50 last:border-0"
                            >
                                {/* Name & subtask */}
                                <div className="col-span-2 pr-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="shrink-0" />
                                        <span className="font-medium truncate">{task.title}</span>
                                    </div>
                                    {task.subTasks?.map((sub, i) => (
                                        <div
                                            key={i}
                                            className="ml-6 mt-1 text-gray-400 flex items-center gap-1 text-xs"
                                        >
                                            <span>↳</span>
                                            <span className="truncate">{sub.title}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Types */}
                                <div className="flex flex-wrap gap-1">
                                    {task.types.map((type, i) => (
                                        <span
                                            key={i}
                                            className={`px-2 py-0.5 text-xs rounded-full ${
                                                typeColorMap[type] || 'bg-gray-200 text-gray-800'
                                            }`}
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>

                                {/* Assignee */}
                                <div className="text-gray-600 truncate pr-2">
                                    {task.userIds.map((u, i) => (
                                        <span key={i}>
                                            {u.name}
                                            {i < task.userIds.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>

                                {/* Start Date */}
                                <div className="text-gray-500 text-xs">
                                    {formatDateTime(new Date(task.startDay * 1000), 'dd-MMM-yyyy, HH:mm')}
                                </div>

                                {/* Due Date */}
                                <div className="text-gray-500 text-xs">
                                    {formatDateTime(new Date(task.dueDay * 1000), 'dd-MMM-yyyy, HH:mm')}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default ProjectTasks;
