import '@emotion/react';
import { Theme as CustomTheme } from '../theme';

declare module '@emotion/react' {
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
}

export {}; 