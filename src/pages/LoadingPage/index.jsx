import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserInformation } from '../../store/slices/AuthSlice';
import { getAllProjects } from '../../store/slices/ProjectSlice';

function LoadingPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            if (token && userId) {
                try {
                    await Promise.all([dispatch(getUserInformation(userId)), dispatch(getAllProjects(userId))]);
                    navigate(`/my-task/${userId}`, { replace: true });
                } catch (err) {
                    console.error(err);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate, dispatch]);
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2Icon className="animate-spin h-20 w-20 text-gray-500" />
        </div>
    );
}

export default LoadingPage;
