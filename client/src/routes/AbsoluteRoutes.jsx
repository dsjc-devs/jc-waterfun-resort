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

// accommodations 
const Amenities = Loadable(lazy(() => import('pages/amenities')));
const AmenitiesDetails = Loadable(lazy(() => import('pages/amenities/details')));

// articles
const Articles = Loadable(lazy(() => import('pages/articles')));
const ArticleDetails = Loadable(lazy(() => import('pages/articles/details')));

// book reservation 
const BookReservation = Loadable(lazy(() => import('pages/book-reservation')));

// policies
const Policies = Loadable(lazy(() => import('pages/policies')));

// resort rates
const ResortRates = Loadable(lazy(() => import('pages/resort-rates')));

// gallery
const Gallery = Loadable(lazy(() => import('pages/gallery')));

// testimonials
const Testimonials = Loadable(lazy(() => import('pages/testimonials')));

const NotFoundPage = Loadable(lazy(() => import('pages/maintenance/404')));

// success
const PaymentResult = Loadable(lazy(() => import('pages/payment-result')));

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

    // amenities
    {
      path: '/amenities',
      children: [
        {
          index: true,
          element: <PageWrapper children={<Amenities />} />
        },
        {
          path: 'details/:id',
          element: <PageWrapper hasBanner={false} children={<AmenitiesDetails />} />
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
      path: '/payment-result',
      element: <PageWrapper hasBanner={false} children={<PaymentResult />} />
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

    // gallery
    {
      path: '/gallery',
      children: [
        {
          index: true,
          element: <PageWrapper hasBanner={true} children={<Gallery />} />
        },
      ]
    },

    // testimonials
    {
      path: '/testimonials',
      children: [
        {
          index: true,
          element: <PageWrapper hasBanner={true} children={<Testimonials />} />
        },
      ]
    },

    // resort rates
    {
      path: '/resort-rates',
      children: [
        {
          index: true,
          element: <PageWrapper hasBanner={false} children={<ResortRates />} />
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