import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { Alert } from '@components/ui/Alert';

interface CsAgentGuardProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
}

export const CsAgentGuard: React.FC<CsAgentGuardProps> = ({ 
  children, 
  fallback: Fallback 
}) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Verifying permissions...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check if user has CS Agent role
  const isCsAgent = user.role === 'CS_Agent' || user.role === 'agent';
  
  if (!isCsAgent) {
    // Show custom fallback component or default unauthorized message
    if (Fallback) {
      return <Fallback />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full">
          <Alert 
            type="error" 
            title="Access Denied"
            className="mb-6"
          >
            You don't have permission to access the CS Agent dashboard. 
            Please contact your administrator if you believe this is an error.
          </Alert>
          
          <div className="text-center space-y-4">
            <button
              onClick={() => window.history.back()}
              className="btn btn-secondary"
            >
              Go Back
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current role: <span className="font-medium">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has CS Agent role
  return <>{children}</>;
};

// Hook for checking CS Agent permissions in components
export const useCsAgentAuth = () => {
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const isCsAgent = React.useMemo(() => {
    return user?.role === 'CS_Agent' || user?.role === 'agent';
  }, [user?.role]);

  const hasPermission = React.useMemo(() => {
    return isAuthenticated && isCsAgent;
  }, [isAuthenticated, isCsAgent]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isCsAgent,
    hasPermission,
  };
};
