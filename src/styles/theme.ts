export const theme = {
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    background: '#FFFFFF',
    text: '#333333',
    error: '#FF4B4B',
    success: '#4CAF50',
    warning: '#FFC107',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body: {
      fontSize: '1rem',
      fontWeight: 400,
    },
  },
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
  },
};

export type Theme = typeof theme; 