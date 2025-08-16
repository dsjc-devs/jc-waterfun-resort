import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import { JWTProvider as AuthProvider } from './contexts/JWTContext';
import { Bounce, ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'contexts/SnackbarContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {

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
    </ThemeCustomization >
  );
}
