'use client';
import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/helpers/utils';

export const Dialog = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) => {
  return (
    <DialogPrimitive.Root
      {...props}
      onOpenChange={(open) => {
        if (open) {
          document.body.classList.add('overflow-hidden');
        } else {
          document.body.classList.remove('overflow-hidden');
        }
        props?.onOpenChange?.(open);
      }}
    >
      {children}
    </DialogPrimitive.Root>
  );
};

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.memo(
  React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
      classNameX?: string;
    }
  >(({ className, children, classNameX = '', ...props }, ref) => {
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
            className={`absolute right-4 top-[14px] rounded-[50%] bg-white opacity-70 transition-opacity hover:opacity-100 ${classNameX}`}
          >
            <X className="h-5 w-5 text-blue-1" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  })
);
