import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import assets from '../../constants/icon';

function ProjectTasks({ teamName, taskCount, endDate, tasks }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const typeColorMap = {
        Design: 'bg-yellow-200 text-yellow-800',
        Research: 'bg-pink-200 text-pink-800',
        'Q&A': 'bg-blue-200 text-blue-800',
        Development: 'bg-green-200 text-green-800',
        Development2: 'bg-purple-200 text-purple-800',
        Development3: 'bg-red-200 text-red-800',
    };

    return (
        <div className="bg-white rounded-lg mb-4">
            {/* Header */}
            <div
                className={`flex justify-between items-center cursor-pointer p-6 ${
                    isExpanded ? 'border-b border-gray-200' : ''
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 font-semibold text-2xl">
                    <div className="flex gap-2">
                        {isExpanded ? (
                            <FontAwesomeIcon icon={assets.icon.upChevron} />
                        ) : (
                            <FontAwesomeIcon icon={assets.icon.dropdown} />
                        )}
                        <span>#{teamName} tasks</span>
                    </div>
                    <span className="text-xl font-normal text-gray-500">
                        ({taskCount} task{taskCount > 1 ? 's' : ''})
                    </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={assets.icon.clock} />
                    <div className="text-xl flex gap-2">
                        <span className="font-bold">End date:</span>
                        <div> {endDate}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 rounded-md">
                    {/* Header row */}
                    <div className="grid grid-cols-6 font-semibold text-2xl">
                        <span className="col-span-2">NAME TASK</span>
                        <span>Types</span>
                        <span>ASSIGNEE</span>
                        <span>START DATE</span>
                        <span>DUE DATE</span>
                    </div>

                    {/* Task rows */}
                    {tasks.map((task, idx) => (
                        <div key={idx} className="grid grid-cols-6 text-xl items-start py-3">
                            {/* Name & subtask */}
                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" />
                                    <span className="font-medium">{task.name}</span>
                                </div>
                                {task.subTasks?.map((sub, i) => (
                                    <div key={i} className="ml-6 mt-1 text-gray-500 flex items-center gap-2">
                                        <span>↳</span>
                                        <span>{sub}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Types */}
                            <div className="flex flex-wrap gap-2">
                                {task.types.map((type, i) => (
                                    <span
                                        key={i}
                                        className={`px-2 py-1 text-base rounded-full ${
                                            typeColorMap[type] || 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {type}
                                    </span>
                                ))}
                            </div>

                            {/* Assignee */}
                            <div>{task.assignee}</div>
                            {/* Start Dates */}
                            <div className="text-lg">
                                <span>{task.startDate}</span>
                            </div>

                            {/* Due Dates */}
                            <div className="text-lg">
                                <span>{task.dueDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectTasks;
