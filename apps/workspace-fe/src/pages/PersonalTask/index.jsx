import RecentProjectTag from './RecentProjectTag';
import cloudIcon from '../../assets/icons/Cloud.svg';
import ProjectTasks from './ProjectTasks';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersTask } from '../../store/slices/AuthSlice';
import CreateProjectModal from '../../components/CreateProjectModal';
import { Button } from '../../components/ui/button';

function PersonalTaskPage() {
    const dispatch = useDispatch();

    // Redux States
    const isLoading = useSelector((state) => state.project.loading);
    const userTasks = useSelector((state) => state.auth.usersTask);
    const projects = useSelector((state) => state.project.projects);
    const user = useSelector((state) => state.auth.user);

    // Fetch user tasks when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getAllUsersTask(user.id)).unwrap();
        };
        fetchData();
    }, [dispatch, user.id]);

    return (
        <div className="bg-secondary size-full p-6">
            <h1 className="font-bold text-3xl">For you</h1>
            <hr className="my-4 border border-[#D9D9D9]" />
            <div className="flex items-center justify-between">
                <h2 className="font-semibold mb-4">Recent projects</h2>
                <CreateProjectModal
                    triggerBtn={
                        <Button className="my-4 p-6 rounded-lg" data-testid="create-project-btn">
                            <p className=" text-lg leading-0">Create Project</p>
                        </Button>
                    }
                />
            </div>
            <div className="flex flex-wrap gap-8 mb-18">
                {projects.map((proj) => {
                    return <RecentProjectTag key={proj.id} icon={cloudIcon} project={proj} />;
                })}
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                projects.map((proj, index) => {
                    const tasksData = userTasks.filter((task) => {
                        return task.project._id === proj.id;
                    });

                    return (
                        <ProjectTasks
                            key={index}
                            teamName={proj.title}
                            taskCount={tasksData.length}
                            endDate={proj.dueDay}
                            tasks={tasksData}
                        />
                    );
                })
            )}
        </div>
    );
}

export default PersonalTaskPage;
