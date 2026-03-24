import { Route, BrowserRouter as Router, Routes } from 'react-router';
import privateRoutes from './routes';
import { AuthenticationLayout, DefaultLayout } from './components/layout';
import LoadingPage from './pages/LoadingPage';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

// eslint-disable-next-line react-refresh/only-export-components
export const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'myrealm',
    clientId: 'workspace',
});

function App() {
    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                checkLoginIframe: false,
                pkceMethod: 'S256',
                onLoad: 'check-sso',
            }}
        >
            <Router>
                <>
                    <Routes>
                        <Route path="/" element={<LoadingPage />} />

                        {privateRoutes.map((route, index) => {
                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.thread === 'auth') {
                                Layout = AuthenticationLayout;
                            } else if (route.thread === 'none-layout') {
                                Layout = 'div';
                            } else {
                                Layout = DefaultLayout;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout className="w-full h-screen">
                                            <route.component />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </>
            </Router>
        </ReactKeycloakProvider>
    );
}

export default App;
