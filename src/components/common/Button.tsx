import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'danger' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  font?: 'sans' | 'serif' | 'mono';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  font = 'sans',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  style,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      : variant === 'secondary'
      ? 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400'
      : variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
      : '';

  const sizeStyles =
    size === 'sm'
      ? 'px-3 py-1 text-sm'
      : size === 'lg'
      ? 'px-6 py-3 text-lg'
      : 'px-4 py-2 text-base'; // md

  const fontStyles =
    font === 'serif'
      ? 'font-serif'
      : font === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const disabledStyles =
    disabled || loading
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${fontStyles} ${disabledStyles} ${className}`}
      style={style}
    >
      {loading && (
        <div className="size-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
      )}
      {children}
    </button>
  );
}
