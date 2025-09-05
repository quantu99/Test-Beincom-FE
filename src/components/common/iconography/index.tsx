/* eslint-disable react/display-name */
import { memo } from 'react';
import { ICON_TYPE } from '@/types';
import CircleCheck from '@/assets/icons/circle-check.svg';
import GoogleIcon from '@/assets/icons/google-icon.svg';
import EyeOpen from '@/assets/icons/eye-open.svg';
import EyeClose from '@/assets/icons/eye-close.svg';
import ChatBubble from '@/assets/icons/chat-bubble.svg';
import Home from '@/assets/icons/home.svg';
import Group from '@/assets/icons/group.svg';
import Market from '@/assets/icons/market.svg';
import Bell from '@/assets/icons/bell.svg';
import Magnifest from '@/assets/icons/magnifest.svg';

export const CSCircleCheck = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <CircleCheck
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSGoogleIcon = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <GoogleIcon
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSEyeOpen = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <EyeOpen
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSEyeClose = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <EyeClose
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSChatBubble = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <ChatBubble
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSHome = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <Home
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSGroup = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <Group
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSMarket = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <Market
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSBell = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <Bell
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
export const CSMagnifest = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <Magnifest
      className={className}
      style={style}
      onClick={onClick}
    />
  ),
);
