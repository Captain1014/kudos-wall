export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    textLight: string;
    error: string;
    background: string;
    cardBackground: string;
    border: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

export const theme: Theme = {
  colors: {
    primary: '#8A2BE2', // 로얄 퍼플
    secondary: '#9B4DCA', // 밝은 퍼플
    text: '#FFFFFF',
    textLight: '#B0B0B0',
    error: '#FF5252',
    background: '#121212',
    cardBackground: '#1E1E1E',
    border: '#333333',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
}; 