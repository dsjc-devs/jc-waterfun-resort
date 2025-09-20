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

// articles
const Articles = Loadable(lazy(() => import('pages/articles')));
const ArticleDetails = Loadable(lazy(() => import('pages/articles/details')));

// book reservation 
const BookReservation = Loadable(lazy(() => import('pages/book-reservation')));

// policies
const Policies = Loadable(lazy(() => import('pages/policies')));

const NotFoundPage = Loadable(lazy(() => import('pages/maintenance/404')));

// success
const SuccessReservation = Loadable(lazy(() => import('pages/success/reservation')));

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
      element: <PageWrapper hasBanner={false} children={<BookNow />} />
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

    // articles
    {
      path: '/articles',
      children: [
        {
          index: true,
          element: <PageWrapper children={<Articles />} />
        },
        {
          path: 'details/:id',
          element: <PageWrapper hasBanner={false} children={<ArticleDetails />} />
        },
      ]
    },

    // book reservations
    {
      path: '/book-a-reservation',
      element: <PageWrapper hasBanner={false} children={<BookReservation />} />
    },

    {
      path: '/success-reservation',
      element: <SuccessReservation />
    },

    // policies

    {
      path: '/policies',
      children: [
        {
          index: true,
          element: <PageWrapper hasBanner={false} children={<Policies />} />
        },
      ]
    },

    {
      path: '*',
      element: <NotFoundPage />
    }
  ]

};

export default AbsoluteRoutes