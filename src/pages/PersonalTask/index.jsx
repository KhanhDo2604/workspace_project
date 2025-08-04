import RecentProjectTag from './RecentProjectTag';
import cloudIcon from '../../assets/icons/Cloud.svg';
import ProjectTasks from './ProjectTasks';

function PersonalTaskPage() {
    const project = [
        {
            number: 'Project 1',
            title: 'Cloud Migration',
            members: ['1', '2', '3'],
        },
        {
            number: 'Project 2',
            title: 'Data Analysis',
            members: ['1', '2'],
        },
    ];

    const tasksData = [
        {
            name: 'Task 1',
            subTasks: ['Sub Task 1'],
            types: ['Design', 'Research', 'Q&A', 'Development', 'Development2', 'Development3'],
            assignee: 'Khanh Do',
            startDate: '19 Jul 2025',
            dueDate: '31 Oct 2025',
        },
    ];

    return (
        <div className="bg-secondary size-full p-6">
            <h1 className="font-bold text-3xl">For you</h1>
            <hr className="my-4 border border-[#D9D9D9]" />
            <h2 className="font-semibold mb-4">Recent projects</h2>
            <div className="flex flex-wrap gap-8 mb-18">
                {project.map((proj, index) => (
                    <RecentProjectTag key={index} icon={cloudIcon} color="#004643" project={proj} />
                ))}
            </div>

            <ProjectTasks teamName="Team 1" taskCount={1} endDate="31 Oct 2025" tasks={tasksData} />

            <ProjectTasks teamName="Team 2" taskCount={12} endDate="31 Oct 2025" tasks={[]} />
        </div>
    );
}

export default PersonalTaskPage;
