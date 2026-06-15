import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import store, { persistor } from './store/index';
import { Provider } from 'react-redux';
import './style.css';
import { PersistGate } from 'redux-persist/integration/react';
import { Loader2Icon } from 'lucide-react';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate
            loading={
                <div className="flex justify-center items-center h-screen">
                    <Loader2Icon className="animate-spin h-20 w-20 text-gray-500" />
                </div>
            }
            persistor={persistor}
        >
            <App />
        </PersistGate>
    </Provider>,
);
