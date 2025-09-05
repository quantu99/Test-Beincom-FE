import background from '@/assets/images/background.webp';
import logo from '@/assets/images/logo.png';
import shortlogo from '@/assets/images/short-logo.png';
import darklogo from '@/assets/images/dark-logo.png';
import eventbanner from '@/assets/images/event-banner.png';
import { CSGroup, CSHome, CSMarket } from '@/components/common/iconography';

export const VARIABLE_CONSTANT = {
  BACKGROUND: background,
  LOGO: logo,
  SHORT_LOGO: shortlogo,
  DARK_LOGO: darklogo,
  EVENT_BANNER: eventbanner,
};

export const SLOGAN_CONSTANT = {
  LOGIN: [
    {
      id: 1,
      title: 'Social Community Platform',
      subTitle:
        'Beincom is the platform for building and engaging with communities.',
    },
    {
      id: 2,
      title: 'Always Reach',
      subTitle:
        "Contents created by communities are always distributed to all members' newsfeeds.",
    },
    {
      id: 3,
      title: 'Quality Content',
      subTitle: 'Read & Write with quality and earn rewards for each post.',
    },
    {
      id: 4,
      title: 'Security',
      subTitle:
        'Rigorous account verification and security mechanisms using Web3 (Blockchain) technology.',
    },
  ],
};

export const MENU_ARR = [
  {
    url: '/',
    label: 'Newsfeed',
    icon: CSHome,
  },
  {
    url: '#',
    label: 'Communities',
    icon: CSGroup,
  },
  {
    url: '#',
    label: 'Marketplace',
    icon: CSMarket,
  },
];
