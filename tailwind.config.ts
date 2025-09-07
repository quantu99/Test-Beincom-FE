import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        customBlack: {
          1: '#171717',
          2: '#2E3660',
        },
        customGray: {
          1: '#EAEDF2',
          2: '#ECEEF6',
          3: '#F4EFFB',
        },
        customPurple: {
          1: '#6F32BB',
          2: '#5F2BA0',
          3: '#B3B9DA',
          4: '#8043CC',
          5: '#DAC9F0',
        },
        customBlue: {
          1: '#0961ED',
          2: '#074DBC',
          3: '#444F8E',
          4: '#6E79B9',
        },
        customOrange: {
          1: '#CB5D00',
        },
        customGreen: {
          1: '#07A721',
        },
        neutral: {
          1: 'rgba(248 248 251)',
          2: 'rgba(236 238 246)',
          5: 'rgba(214 217 235)',
          10: 'rgba( 179 185 218)',
          20: 'rgba(144 153 202)',
          30: 'rgba(110 121 185)',
          40: 'rgba(68 79 142)',
          50: 'rgba(57 67 119)',
          60: 'rgba(46 54 96)',
          70: 'rgba(35 41 73)',
          80: 'rgba(35 41 73)',
          90: 'rgba(7 9 16)',
          100: 'rgba(171 145 191)',
        },
      },
      screens: {
        xs: '575.98px',
        xl: '1279.98px',
      },

      minWidth: {
        'custom-1': '288px',
      },
      maxWidth: {
        'custom-1': '320px',
      },
    },
  },
  plugins: [],
};
export default config;
