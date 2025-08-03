import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// Lazy-loaded components
const DashboardDefault = Loadable(lazy(() => import('pages/portal/dashboard')));
const UnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));

// pages
const Staffs = Loadable(lazy(() => import('pages/portal/staffs')));

const Customers = Loadable(lazy(() => import('pages/portal/customers')));
const CustomersDetails = Loadable(lazy(() => import('pages/portal/customers/details')));

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
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
          path: 'staffs',
          element: <Staffs />
        },
        {
          path: 'customers',
          children: [
            {
              index: true,
              element: <Customers />
            },
            {
              path: 'details/:id',
              element: <CustomersDetails />
            }
          ]
        },
        {
          path: 'rooms',
          element: <UnderConstruction />
        },
        {
          path: 'reservations',
          element: <UnderConstruction />
        },
        {
          path: 'calendar',
          element: <UnderConstruction />
        },
        {
          path: 'banners',
          element: <UnderConstruction />
        },
        {
          path: 'promotions',
          element: <UnderConstruction />
        },
        {
          path: 'my-reservations',
          element: <UnderConstruction />
        }
      ]
    }
  ]
};

export default MainRoutes;
