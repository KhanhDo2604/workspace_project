import { Route, BrowserRouter as Router, Routes } from 'react-router';
import privateRoutes from './routes';
import { AuthenticationLayout, DefaultLayout } from './components/layout';
import { Fragment } from 'react';

function App() {
    return (
        <Router>
            <>
                <Routes>
                    {privateRoutes.map((route, index) => {
                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.thread === 'auth') {
                            Layout = AuthenticationLayout;
                        } else {
                            Layout = DefaultLayout;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
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
