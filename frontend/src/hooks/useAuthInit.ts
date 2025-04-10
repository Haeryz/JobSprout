import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// Hook to initialize Firebase authentication state
export const useAuthInit = () => {
  const initAuth = useAuthStore(state => state.initAuth);
  
  useEffect(() => {
    // Initialize authentication on app startup
    const unsubscribe = initAuth();
    
    // Cleanup on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initAuth]);
  
  return null;
}; 