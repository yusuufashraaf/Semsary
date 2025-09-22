/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry if the error is due to cancellation
        if (error?.name === 'CanceledError' || error?.message === 'canceled') {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations if they're cancelled
        if (error?.name === 'CanceledError' || error?.message === 'canceled') {
          return false;
        }
        return failureCount < 1;
      },
      onError: (error: any) => {
        // Don't show toast for cancelled requests
        if (error?.name !== 'CanceledError' && error?.message !== 'canceled') {
          toast.error(error?.message || 'An error occurred');
        }
      },
    },
  },
});

// Global error handler for React Query
export const handleQueryError = (error: any) => {
  if (error?.name === 'CanceledError' || error?.message === 'canceled') {
    console.log('Request was cancelled');
    return { message: 'Request was cancelled' };
  }
  
  const errorMessage = error?.message || 'An unexpected error occurred';
  console.error('Query error:', error);
  toast.error(errorMessage);
  
  return { message: errorMessage };
};