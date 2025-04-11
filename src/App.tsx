import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './router';
import { theme } from './theme';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme.colors.cardBackground,
              color: theme.colors.text,
            },
            success: {
              iconTheme: {
                primary: '#4CAF50',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#f44336',
                secondary: 'white',
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
