import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import OtherProfile from '../pages/OtherProfile';
import KPI from '../pages/KPI';
import KPICreate from '../pages/KPICreate';
import Kudos from '../pages/Kudos';
import NotFound from '../pages/NotFound';
import PrivateRoute from '../components/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
      },
      {
        path: 'profile',
        element: <PrivateRoute><Profile /></PrivateRoute>,
      },
      {
        path: 'other-profile/:id',
        element:  <PrivateRoute><OtherProfile /></PrivateRoute>,
      },
      {
        path: 'kpi',
        element: <PrivateRoute><KPI /></PrivateRoute>,
      },
      {
        path: 'kpi/new',
        element: <PrivateRoute><KPICreate /></PrivateRoute>,
      },
      {
        path: 'kpi/:id/edit',
        element: <PrivateRoute><KPICreate /></PrivateRoute>,
      },
      {
        path: 'kudos',
        element: <PrivateRoute><Kudos /></PrivateRoute>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]); 