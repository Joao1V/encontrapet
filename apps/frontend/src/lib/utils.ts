import type { InputProps } from '@heroui/react';
import { type ClassValue, clsx } from 'clsx';
import type { ControllerFieldState } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function getFieldErrorProps(fieldState: ControllerFieldState) {
   return {
      color: fieldState.error ? 'danger' : undefined,
      isInvalid: !!fieldState.error,
      errorMessage: fieldState.error?.message,
   } as Pick<InputProps, 'color' | 'isInvalid' | 'errorMessage'>;
}
