
import { RouterProvider } from 'react-router-dom';

// project import
import React from 'react';
import router from 'routes';
import ThemeCustomization from 'themes';

import { Helmet } from 'react-helmet';
import { useGetResortDetails } from 'api/resort-details';
import { JWTProvider as AuthProvider } from './contexts/JWTContext';
import { Bounce, ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'contexts/SnackbarContext';

import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";

import 'styles/main.css'

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const { resortDetails } = useGetResortDetails()

  React.useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    gsap.fromTo(
      "body",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <ThemeCustomization>
      <SnackbarProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </SnackbarProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <Helmet>
        <title>{resortDetails?.companyInfo?.name}</title>
        <meta
          name="description"
          content="Enjoy family fun and relaxation at JC Waterfun Resort."
        />
        <link rel="icon" type="image/png" href={resortDetails?.companyInfo?.logo} />
      </Helmet>
    </ThemeCustomization >
  );
}
