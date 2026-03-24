import { Loader2Icon } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../store/slices/ProjectSlice';

import { useKeycloak } from '@react-keycloak/web';
import { syncUser } from '../../store/slices/AuthSlice';

function LoadingPage() {
    const { keycloak, initialized } = useKeycloak();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialized) {
            return;
        }

        if (!keycloak.authenticated) {
            keycloak.login();
            return;
        }

        const fetchUserData = async () => {
            try {
                // const token = keycloak.token;
                // const userId = keycloak.tokenParsed?.sub;

                const user = await dispatch(syncUser(keycloak.token)).unwrap();

                await dispatch(getAllProjects(user.id));
                navigate(`/my-space/${user.id}`, { replace: true });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialized, keycloak.authenticated]);

    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2Icon className="animate-spin h-20 w-20 text-gray-500" />
        </div>
    );
}

export default LoadingPage;
