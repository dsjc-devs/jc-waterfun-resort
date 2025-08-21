import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import { JWTProvider as AuthProvider } from './contexts/JWTContext';
import { Bounce, ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'contexts/SnackbarContext';

import 'styles/main.css'
import { Helmet } from 'react-helmet';
import { useGetResortDetails } from 'api/resort-details';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const { resortDetails } = useGetResortDetails()

  console.log(resortDetails);


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
