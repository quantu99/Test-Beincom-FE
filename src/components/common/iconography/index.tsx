/* eslint-disable react/display-name */
import { memo } from 'react';
import { ICON_TYPE } from '@/types';
import CircleCheck from '@/assets/icons/circle-check.svg';
import GoogleIcon from '@/assets/icons/google-icon.svg';
import EyeOpen from '@/assets/icons/eye-open.svg';
import EyeClose from '@/assets/icons/eye-close.svg';
import ChatBubble from '@/assets/icons/chat-bubble.svg';

export const CSCircleCheck = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <CircleCheck
      className={className}
      style={style}
      onClick={onClick}
    />
  )
);
export const CSGoogleIcon = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <GoogleIcon
      className={className}
      style={style}
      onClick={onClick}
    />
  )
);
export const CSEyeOpen = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <EyeOpen
      className={className}
      style={style}
      onClick={onClick}
    />
  )
);
export const CSEyeClose = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <EyeClose
      className={className}
      style={style}
      onClick={onClick}
    />
  )
);
export const CSChatBubble = memo(
  ({ className = '', style = {}, onClick = null }: ICON_TYPE) => (
    <ChatBubble
      className={className}
      style={style}
      onClick={onClick}
    />
  )
);
