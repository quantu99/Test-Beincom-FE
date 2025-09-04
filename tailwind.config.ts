import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        customPurple: {
          1: '#6F35BB',
          2: '#5F2BA0',
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
        },
      },
      screens: {
        xs: '575.98px',
        xl: '1279.98px',
      },
    },
  },
  plugins: [],
};
export default config;
