import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// Lazy-loaded components
const DashboardDefault = Loadable(lazy(() => import('pages/portal/dashboard')));
const UnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));

// pages

// staffs
const Staffs = Loadable(lazy(() => import('pages/portal/staffs')));

// customers
const Customers = Loadable(lazy(() => import('pages/portal/customers')));
const CustomersDetails = Loadable(lazy(() => import('pages/portal/customers/details')));

// accommodations
const Accommodations = Loadable(lazy(() => import('pages/portal/accommodations')));
const AccommodationDetails = Loadable(lazy(() => import('pages/portal/accommodations/details')));
const AccommodationForm = Loadable(lazy(() => import('pages/portal/accommodations/form')));

// reservations
const Reservations = Loadable(lazy(() => import('pages/portal/reservations')));
const ReservationDetails = Loadable(lazy(() => import('pages/portal/reservations/details')));
const ReservationForm = Loadable(lazy(() => import('pages/portal/reservations/form')));

// profile
const ViewProfile = Loadable(lazy(() => import('pages/portal/profile/view')));
const EditProfile = Loadable(lazy(() => import('pages/portal/profile/edit')));

// content management
const AccommodationType = Loadable(lazy(() => import('pages/portal/accommodation-type')));
const AmenityType = Loadable(lazy(() => import('pages/portal/amenity-type')));
const AboutUs = Loadable(lazy(() => import('pages/portal/content-management/about-us')));
const CompanyInfo = Loadable(lazy(() => import('pages/portal/content-management/company-info')));
const Faqs = Loadable(lazy(() => import('pages/portal/content-management/faqs')));
const Articles = Loadable(lazy(() => import('pages/portal/content-management/articles')));
const ArticleDetails = Loadable(lazy(() => import('pages/portal/content-management/articles/details')));
const ArticleForm = Loadable(lazy(() => import('pages/portal/content-management/articles/form')));
const Policies = Loadable(lazy(() => import('pages/portal/content-management/policies')));
const PolicyForm = Loadable(lazy(() => import('pages/portal/content-management/policies/form')));

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
          path: 'accommodations',
          children: [
            {
              index: true,
              element: <Accommodations />
            },
            {
              path: 'details/:id',
              element: <AccommodationDetails />
            },
            {
              path: 'form',
              element: <AccommodationForm />
            }
          ]
        },
        {
          path: 'reservations',
          children: [
            {
              index: true,
              element: <Reservations />
            },
            {
              path: 'details/:id',
              element: <ReservationDetails />
            },
            {
              path: 'form',
              element: <ReservationForm />
            },
          ]
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
        },
        {
          path: 'content-management',
          children: [
            {
              path: 'accommodation-type',
              element: <AccommodationType />
            },
            {
              path: 'amenity-type',
              element: <AmenityType />
            },
            {
              path: 'articles',
              children: [
                {
                  index: true,
                  element: <Articles />
                },
                {
                  path: 'details/:id',
                  element: <ArticleDetails />
                },
                {
                  path: 'form',
                  element: <ArticleForm />
                },
              ]
            },
            {
              path: 'about-us',
              element: <AboutUs />
            },
            {
              path: 'company-info',
              element: <CompanyInfo />
            },
            {
              path: 'faqs',
              element: <Faqs />
            },
            {
              path: 'policies',
              children: [
                {
                  index: true,
                  element: <Policies />
                },
                {
                  path: 'form',
                  element: <PolicyForm />
                }
              ]
            },
          ]
        },
        {
          path: 'profile',
          children: [
            {
              path: 'view',
              element: <ViewProfile />
            },
            {
              path: 'edit',
              element: <EditProfile />
            },
          ]
        },
      ]
    }
  ]
};

export default MainRoutes;
