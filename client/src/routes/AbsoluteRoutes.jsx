import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import PageWrapper from '../layout/Wrapper/Wrapper'

// render - absolute pages
const Home = Loadable(lazy(() => import('pages/home/index')));

const NotFoundPage = Loadable(lazy(() => import('pages/portal/maintenance/404')));

// ==============================|| AUTH ROUTING ||============================== //

const AbsoluteRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <PageWrapper children={<Home />} />
    },
    {
      path: '*',
      element: <NotFoundPage />
    },
  ]

};

export default AbsoluteRoutes