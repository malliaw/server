import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      accent: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      text: {
        primary: string;
        secondary: string;
        muted: string;
      };
      border: string;
      shadow: string;
    };
    fonts: {
      mono: string;
      sans: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
    animations: {
      fast: string;
      normal: string;
      slow: string;
    };
  }
}