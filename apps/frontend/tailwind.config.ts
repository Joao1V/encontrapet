import { heroui } from '@heroui/theme';

import type { Config } from 'tailwindcss';

const config: Config = {
   content: [
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
      './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
   ],
   theme: {
      extend: {
         fontFamily: {
            sans: ['var(--font-sans)'],
            mono: ['var(--font-mono)'],
         },
      },
   },
   darkMode: 'class',
   plugins: [
      heroui({
         themes: {
            light: {
               colors: {
                  primary: {
                     50: '#fcebe1',
                     100: '#f7d0b8',
                     200: '#f2b48e',
                     300: '#ed9965',
                     400: '#e97d3b',
                     500: '#e46212',
                     600: '#bc510f',
                     700: '#94400c',
                     800: '#6c2f09',
                     900: '#441d05',
                     foreground: '#fff',
                     DEFAULT: '#e46212',
                  },
                  secondary: {
                     50: '#e2f7f7',
                     100: '#b9ebeb',
                     200: '#90dfdf',
                     300: '#68d3d3',
                     400: '#3fc8c8',
                     500: '#16bcbc',
                     600: '#129b9b',
                     700: '#0e7a7a',
                     800: '#0a5959',
                     900: '#073838',
                     foreground: '#fff',
                     DEFAULT: '#16bcbc',
                  },
                  success: {
                     50: '#e2f8ec',
                     100: '#b9efd1',
                     200: '#91e5b5',
                     300: '#68dc9a',
                     400: '#40d27f',
                     500: '#17c964',
                     600: '#13a653',
                     700: '#0f8341',
                     800: '#0b5f30',
                     900: '#073c1e',
                     foreground: '#000',
                     DEFAULT: '#17c964',
                  },
                  warning: {
                     50: '#fef4e4',
                     100: '#fce4bd',
                     200: '#fad497',
                     300: '#f9c571',
                     400: '#f7b54a',
                     500: '#f5a524',
                     600: '#ca881e',
                     700: '#9f6b17',
                     800: '#744e11',
                     900: '#4a320b',
                     foreground: '#000',
                     DEFAULT: '#f5a524',
                  },
                  danger: {
                     50: '#fee1eb',
                     100: '#fbb8cf',
                     200: '#f98eb3',
                     300: '#f76598',
                     400: '#f53b7c',
                     500: '#f31260',
                     600: '#c80f4f',
                     700: '#9e0c3e',
                     800: '#73092e',
                     900: '#49051d',
                     foreground: '#fff',
                     DEFAULT: '#f31260',
                  },
                  background: '#ffffff',
                  content1: {
                     DEFAULT: '#ffffff',
                     foreground: '#fff',
                  },
                  content2: {
                     DEFAULT: '#f4f4f5',
                     foreground: '#000',
                  },
                  content3: {
                     DEFAULT: '#e4e4e7',
                     foreground: '#000',
                  },
                  content4: {
                     DEFAULT: '#d4d4d8',
                     foreground: '#000',
                  },
                  focus: '#006FEE',
                  overlay: '#000000',
               },
            },
         },
         layout: {
            disabledOpacity: '0.5',
         },
      }),
   ],
};

export default config;
