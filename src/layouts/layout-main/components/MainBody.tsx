'use client';

import { ROUTE } from '@/constants';
import { useEffectRouter } from '@/helpers/hooks';

export function MainBody({ children } : any) {
  useEffectRouter(({ pathname }) => {
    if (pathname === ROUTE.HOME) {
      document.body.classList.add('is-home');
    } else {
      document.body.classList.remove('is-home');
    }
  }, 'path');

  return <div className="main-body">{children}</div>;
}
