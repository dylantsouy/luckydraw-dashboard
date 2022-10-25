import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Theme from './providers/Theme';
import Layout from './layouts/Layout';
import Snackbar from './providers/Snackbar';
import Login from './containers/Login/Login';
import Page404 from './containers/Page404/Page404';
// import Dashboard from './containers/Dashboard';
import PrivateRoute from './auths/PrivateRoute';
import { LanguageProvider } from './langs/LanguageProvider';
import Compose from 'providers/Compose';
import User from 'containers/User';
import Admin from 'containers/Admin';
import Reward from 'containers/Reward';
import Winning from 'containers/Winning';

function App() {
    return (
        <Compose components={[Theme, Snackbar, LanguageProvider, Layout]}>
            <Routes>
                {/* <Route
                    index
                    path='/dashboard'
                    element={
                        <PrivateRoute permissionName='dashboard'>
                            <Dashboard />
                        </PrivateRoute>
                    }
                /> */}
                <Route index path='/login' element={<Login />} />
                <Route
                    index
                    path='/user'
                    element={
                        <PrivateRoute permissionName='user'>
                            <User />
                        </PrivateRoute>
                    }
                />
                <Route
                    index
                    path='/admin'
                    element={
                        <PrivateRoute permissionName='admin'>
                            <Admin />
                        </PrivateRoute>
                    }
                />
                <Route
                    index
                    path='/reward'
                    element={
                        <PrivateRoute permissionName='reward'>
                            <Reward />
                        </PrivateRoute>
                    }
                />
                <Route
                    index
                    path='/winning'
                    element={
                        <PrivateRoute permissionName='winning'>
                            <Winning />
                        </PrivateRoute>
                    }
                />
                <Route path='/' element={<Navigate to='/user' replace />} />
                <Route path='*' element={<Page404 />} />
            </Routes>
        </Compose>
    );
}

export default App;
