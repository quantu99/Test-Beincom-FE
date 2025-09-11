'use client';

import React, { forwardRef, useState } from 'react';
import { CSEyeOpen, CSEyeClose, CSMagnifest } from './iconography';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'search' | 'comment';
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      showPasswordToggle = false,
      leftIcon,
      rightIcon,
      onRightIconClick,
      containerClassName = '',
      labelClassName = '',
      errorClassName = '',
      helperClassName = '',
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType =
      showPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type;

    const getContainerClasses = () => {
      const baseClasses =
        'relative flex items-center justify-between rounded-md border bg-white px-3 py-2 text-base transition-colors duration-200';

      switch (variant) {
        case 'search':
          return `${baseClasses} h-10  hover:shadow-hover`;
        case 'comment':
          return `${baseClasses} min-h-[51px] border-neutral-5`;
        default:
          return `${baseClasses} h-10  hover:shadow-hover  w-full`;
      }
    };

    const getInputClasses = () => {
      const baseClasses =
        'block w-full bg-transparent text-base font-normal text-neutral-60 caret-neutral-60 placeholder:text-base placeholder:font-normal placeholder:text-neutral-20 autofill:!bg-gray-5 autofill:!text-neutral-60 read-only:cursor-default read-only:bg-gray-5 disabled:bg-gray-5 disabled:font-normal disabled:text-neutral-20 focus:outline-none focus:ring-0 focus:ring-transparent';

      switch (variant) {
        case 'search':
          return `${baseClasses} text-sm placeholder:text-sm placeholder:text-neutral-10 pl-2`;
        case 'comment':
          return `${baseClasses} pr-12`;
        default:
          return `${baseClasses} h-full`;
      }
    };

    const getBorderColor = () => {
      if (error) return 'border-red-50';
      if (isFocused) return 'border-customPurple-4';
      return variant === 'comment' ? 'border-neutral-5' : 'border-gray-30';
    };

    const handleTogglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={`space-y-1 ${containerClassName}`}>
        {label && (
          <label
            className={`text-sm font-medium peer-disabled:cursor-not-allowed text-neutral-40 ${labelClassName}`}
            htmlFor={props.id}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={`${getContainerClasses()} ${getBorderColor()}`}>
          {leftIcon && (
            <span className="flex items-center pr-2 [&>svg>path]:fill-neutral-40">
              {leftIcon}
            </span>
          )}

          {variant === 'search' && !leftIcon && (
            <span className="flex items-center [&>svg>path]:fill-neutral-40">
              <CSMagnifest className="size-5" />
            </span>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`${getInputClasses()} ${className}`}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center [&>svg>path]:fill-neutral-40 focus:outline-none"
            >
              {showPassword ? <CSEyeClose /> : <CSEyeOpen />}
            </button>
          )}

          {rightIcon && !showPasswordToggle && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={`flex items-center focus:outline-none ${
                onRightIconClick ? 'cursor-pointer' : 'cursor-default'
              } ${
                variant === 'comment'
                  ? 'absolute top-1/2 -translate-y-1/2 right-2'
                  : 'pl-2'
              }`}
            >
              {variant === 'comment' && (
                <>
                  <div className="w-px h-3 bg-customGray-1 mr-2" />
                  <div className="size-5 [&>svg>path]:fill-neutral-20">
                    {rightIcon}
                  </div>
                </>
              )}
              {variant !== 'comment' && rightIcon}
            </button>
          )}
        </div>

        {error && (
          <span
            className={`text-red-500 text-xs italic block ${errorClassName}`}
          >
            {error}
          </span>
        )}

        {helperText && !error && (
          <span className={`text-neutral-40 text-xs block ${helperClassName}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';