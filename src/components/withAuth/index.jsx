import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Higher-Order Component (HOC) - withAuth
 * 
 * HOCs are functions that take a component and return a new component with additional props or behavior
 * This HOC adds authentication logic to any component it wraps
 * 
 * Usage:
 * const ProtectedComponent = withAuth(MyComponent);
 * 
 * Benefits:
 * - Reusable authentication logic
 * - Separation of concerns
 * - Can be composed with other HOCs
 */
const withAuth = (WrappedComponent, options = {}) => {
  const {
    requireAuth = true,
    redirectTo = '/login',
    fallbackComponent = null
  } = options;

  // Return a new component
  const WithAuthComponent = (props) => {
    // This would typically come from your auth context or Redux store
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // If authentication is not required, render the component normally
    if (!requireAuth) {
      return <WrappedComponent {...props} isAuthenticated={isAuthenticated} />;
    }

    // If user is not authenticated and auth is required
    if (!isAuthenticated) {
      // Return custom fallback component if provided
      if (fallbackComponent) {
        return fallbackComponent;
      }

      // Default unauthorized UI
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh',
          p: 3
        }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            You need to be authenticated to access this page.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              // Simulate login - in real app this would redirect to login page
              localStorage.setItem('isAuthenticated', 'true');
              window.location.reload();
            }}
          >
            Login
          </Button>
        </Box>
      );
    }

    // User is authenticated, render the wrapped component with additional props
    return (
      <WrappedComponent 
        {...props} 
        isAuthenticated={isAuthenticated}
        logout={() => {
          localStorage.removeItem('isAuthenticated');
          window.location.reload();
        }}
      />
    );
  };

  // Set display name for better debugging
  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth; 