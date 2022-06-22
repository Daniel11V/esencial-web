import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - datas
const Accounts = Loadable(lazy(() => import('pages/components-overview/Accounts')));
const Events = Loadable(lazy(() => import('pages/components-overview/Events')));
const Operations = Loadable(lazy(() => import('pages/components-overview/Operations')));
const Currencies = Loadable(lazy(() => import('pages/components-overview/Currencies')));
const Database = Loadable(lazy(() => import('pages/components-overview/Database')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'events',
            element: <Events />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'operations',
            element: <Operations />
        },
        {
            path: 'accounts',
            element: <Accounts />
        },
        {
            path: 'currencies',
            element: <Currencies />
        },
        {
            path: 'database',
            element: <Database />
        }
    ]
};

export default MainRoutes;
