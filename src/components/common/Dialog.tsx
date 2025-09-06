/* eslint-disable react/display-name */
'use client';
import React, { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/helpers/utils';

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.memo(
  React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
      classNameX?: string;
    }
  >(({ className, children, classNameX = '', ...props }, ref) => {
    useEffect(() => {
      const scrollY = window.scrollY;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';

        window.scrollTo(0, scrollY);
      };
    }, []);

    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay asChild>
          <div className="fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div>
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'fixed z-[100] grid gap-4 bg-white duration-200',
            'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]',
            'h-auto max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)]',
            'sm:w-[calc(100vw-4rem)] sm:max-w-md',
            'md:w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl',
            'rounded-lg sm:rounded-xl',

            'overflow-y-auto overflow-x-hidden',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',

            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className={`absolute right-4 top-[14px] rounded-[50%] bg-white opacity-70 transition-opacity hover:opacity-100  ${classNameX}`}
          >
            <X className="h-5 w-5 text-blue-1" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  })
);

export const DialogHeader = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        'pb-2 sm:pb-4',
        'border-b border-gray-100  sm:border-b-0',
        'mb-2 sm:mb-0',
        className
      )}
      {...props}
    />
  )
);

export const DialogFooter = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      className={cn(
        'flex flex-col gap-2',
        'sm:flex-row-reverse sm:justify-start sm:gap-3',
        'pt-4 sm:pt-6',
        'border-t border-gray-100  sm:border-t-0',
        'mt-4 sm:mt-0',
        className
      )}
      {...props}
    />
  )
);

export const DialogTitle = React.memo(
  React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
  >(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        'text-base font-semibold leading-6 sm:text-lg sm:leading-7 lg:text-xl',
        'text-gray-900 ',
        'tracking-tight',
        'px-1 sm:px-0',
        className
      )}
      {...props}
    />
  ))
);

export const DialogDescription = React.memo(
  React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
  >(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        'text-sm sm:text-[15px]',
        'text-gray-600 ',
        'leading-5 sm:leading-6',
        'px-1 sm:px-0',
        className
      )}
      {...props}
    />
  ))
);
