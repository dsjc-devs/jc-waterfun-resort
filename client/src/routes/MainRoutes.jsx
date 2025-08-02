import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// Lazy-loaded components
const DashboardDefault = Loadable(lazy(() => import('pages/portal/dashboard')));

const UnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <DashboardDefault />
    },
    {
      path: 'portal',
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'human-resource',
          children: [
            {
              path: 'staffs',
              element: <UnderConstruction />
            },
            {
              path: 'customers',
              element: <UnderConstruction />
            }
          ]
        },
        {
          path: 'rooms',
          children: [
            {
              path: '',
              element: <UnderConstruction />
            }
          ]
        },
        {
          path: 'reservations',
          children: [
            {
              path: '',
              element: <UnderConstruction />
            },
            {
              path: 'calendar',
              element: <UnderConstruction />
            },
          ]
        },
        {
          path: 'marketing',
          children: [
            {
              path: 'banners',
              element: <UnderConstruction />
            },
            {
              path: 'promotions',
              element: <UnderConstruction />
            },
          ]
        },
        {
          path: 'tickets',
          children: [
            {
              path: '',
              element: <UnderConstruction />
            },
            {
              path: 'submit',
              element: <UnderConstruction />
            },
          ]
        },
      ]
    }
  ]
};

export default MainRoutes;
