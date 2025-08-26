import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import PageWrapper from '../layout/Wrapper'

// render - absolute pages
const Home = Loadable(lazy(() => import('pages/home')));
const AboutUs = Loadable(lazy(() => import('pages/about-us')));
const ContactUs = Loadable(lazy(() => import('pages/contact-us')));
const BookNow = Loadable(lazy(() => import('pages/book-now')));
const FAQs = Loadable(lazy(() => import('pages/faqs')));

// accommodations 
const Accommodations = Loadable(lazy(() => import('pages/accommodations')));
const AccommodationDetails = Loadable(lazy(() => import('pages/accommodations/details')));

// book reservation 
const BookReservation = Loadable(lazy(() => import('pages/book-reservation')));

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
      path: '/faqs',
      element: <PageWrapper children={<FAQs />} />
    },

    // accommodations
    {
      path: '/accommodations',
      children: [
        {
          index: true,
          element: <PageWrapper children={<Accommodations />} />
        },
        {
          path: 'details/:id',
          element: <PageWrapper hasBanner={false} children={<AccommodationDetails />} />
        },
      ]
    },

    // book reservations
    {
      path: '/book-a-reservation',
      element: <PageWrapper hasBanner={false} children={<BookReservation />} />
    },

    {
      path: '*',
      element: <NotFoundPage />
    }
  ]

};

export default AbsoluteRoutes