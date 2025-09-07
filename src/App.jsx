import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router';
import privateRoutes from './routes';
import { AuthenticationLayout, DefaultLayout } from './components/layout';

function App() {
    return (
        <Router>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />

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
    );
}

export default App;
