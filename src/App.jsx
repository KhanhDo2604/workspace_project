import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router';
import privateRoutes from './routes';
import { AuthenticationLayout, DefaultLayout } from './components/layout';
import LoadingPage from './pages/LoadingPage';

function App() {
    return (
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
    );
}

export default App;
