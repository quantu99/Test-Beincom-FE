import background from '@/assets/images/background.webp';
import logo from '@/assets/images/logo.png';
import shortlogo from '@/assets/images/short-logo.png';
import darklogo from '@/assets/images/dark-logo.png';
import eventbanner from '@/assets/images/event-banner.png';
import eventbanner2 from '@/assets/images/event-banner-2.png';
import eventbanner3 from '@/assets/images/event-banner-3.webp';
import noavatar from '@/assets/images/default-avatar.png';
import shortlogo2 from '@/assets/images/short-logo-2.png';
import medal from '@/assets/images/medal.png';
import { CSGroup, CSHome, CSMarket } from '@/components/common/iconography';

export const VARIABLE_CONSTANT = {
  BACKGROUND: background,
  LOGO: logo,
  SHORT_LOGO: shortlogo,
  DARK_LOGO: darklogo,
  EVENT_BANNER: eventbanner,
  EVENT_BANNER_2: eventbanner2,
  EVENT_BANNER_3: eventbanner3,
  NO_AVATAR: noavatar,
  SHORT_LOGO_2: shortlogo2,
  MEDAL: medal,
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

export const DUMMY_SERVICE_ARR = [
  {
    id: 1,
    title: 'Active BIC Wallet',
    status: 'active',
    action: 'Activate',
  },
  {
    id: 2,
    title: 'Install BIC Group app',
    status: 'inactive',
    action: 'Install',
  },
  {
    id: 3,
    title: 'Verify your account (KYC)',
    status: 'inactive',
    action: 'Verify',
  },
];

export const HELP_MENU = [
  {
    id: 1,
    url: '#',
    title: 'About Beincom',
  },
  {
    id: 2,
    url: '#',
    title: 'Help Center',
  },
  {
    id: 3,
    url: '#',
    title: 'Privacy & Terms',
  },
  {
    id: 4,
    url: '#',
    title: 'Business Services',
  },
  {
    id: 5,
    url: '#',
    title: 'Cryptocurrency',
  },
  {
    id: 6,
    url: '#',
    title: 'Community standards',
  },
];

export const DUMMY_MENU_ARR = [
  {
    id: 'welcome',
    title: 'Welcome to Beincom (BIC)',
    children: [
      { id: 'intro', title: 'Quick Introductions and Guides' },
      { id: 'culture', title: 'Culture and Community Guidelines' },
    ],
  },
  {
    id: 'project',
    title: 'Beincom (BIC) Project',
    children: [
      { id: 'journey', title: 'Beincom - Journey of Aspiration' },
      { id: 'savvy', title: 'Becoming a Savvy BIC Holder' },
      { id: 'tokens', title: 'BIC Tokens Acquisition for Beginners' },
    ],
  },
];
