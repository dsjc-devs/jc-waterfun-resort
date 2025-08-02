import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import PageWrapper from '../layout/Wrapper/Wrapper'

// render - absolute pages
const Home = Loadable(lazy(() => import('pages/home/index')));
const AboutUs = Loadable(lazy(() => import('pages/about-us/index')));
const ContactUs = Loadable(lazy(() => import('pages/contact-us/index')));
const BookNow = Loadable(lazy(() => import('pages/book-now/index')));
const Admission = Loadable(lazy(() => import('pages/addmission/index')));
const Media = Loadable(lazy(() => import('pages/media/index')));

const NotFoundPage = Loadable(lazy(() => import('pages/maintenance/404')));

// ==============================|| AUTH ROUTING ||============================== //

const AbsoluteRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <PageWrapper children={<Home />} />
    },
    {
      path: '/about-us',
      element: <PageWrapper children={<AboutUs />} />
    },
    {
      path: '/contact-us',
      element: <PageWrapper children={<ContactUs />} />
    },
    {
      path: '/book-now',
      element: <PageWrapper children={<BookNow />} />
    },
    {
      path: '/admission',
      element: <PageWrapper children={<Admission />} />
    },
    {
      path: '/media',
      element: <PageWrapper children={<Media />} />
    },
    {
      path: '*',
      element: <NotFoundPage />
    },
  ]

};

export default AbsoluteRoutes