import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllProjects } from '../../store/slices/ProjectSlice';

import { useKeycloak } from '@react-keycloak/web';
import { syncUser } from '../../store/slices/AuthSlice';

function LoadingPage() {
    const { keycloak, initialized } = useKeycloak();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loadingText, setLoadingText] = useState('Initializing...');

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
                setLoadingText('Authenticating...');
                await new Promise((resolve) => setTimeout(resolve, 2000)); // ✅ delay 2s để xem UI

                const user = await dispatch(syncUser(keycloak.token)).unwrap();

                setLoadingText('Loading your workspace...');
                await new Promise((resolve) => setTimeout(resolve, 1500)); // ✅ delay 1.5s

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
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#004643' }}>
            <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                            backgroundColor: '#f9bc60',
                            boxShadow: '0 8px 24px rgba(249,188,96,0.35)',
                        }}
                    >
                        <svg
                            className="w-7 h-7"
                            style={{ color: '#004643' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                            />
                        </svg>
                    </div>
                    <span className="text-3xl font-bold tracking-tight" style={{ color: '#abd1c6' }}>
                        Workspace
                    </span>
                </div>

                <div className="relative w-16 h-16">
                    <div
                        className="absolute inset-0 rounded-full border-4"
                        style={{ borderColor: 'rgba(171,209,198,0.2)' }}
                    />
                    <div
                        className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                        style={{ borderTopColor: '#f9bc60' }}
                    />
                    <div
                        className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
                        style={{
                            borderTopColor: 'rgba(249,188,96,0.4)',
                            animationDuration: '1.5s',
                        }}
                    />
                </div>

                <div className="flex flex-col items-center gap-3">
                    <p className="text-lg font-medium animate-pulse" style={{ color: '#abd1c6' }}>
                        {loadingText}
                    </p>
                    <div className="flex gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{
                                backgroundColor: '#f9bc60',
                                animationDelay: '0ms',
                            }}
                        />
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{
                                backgroundColor: '#f9bc60',
                                animationDelay: '150ms',
                            }}
                        />
                        <span
                            className="w-1.5 h-1.5 rounded-full animate-bounce"
                            style={{
                                backgroundColor: '#f9bc60',
                                animationDelay: '300ms',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadingPage;
