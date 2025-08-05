import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Divider,
  Alert,
  TextField,
  Card,
  CardContent
} from '@mui/material';
import Portal from '../../components/Portal';
import DataFetcher from '../../components/DataFetcher';
import withAuth from '../../components/withAuth';
import useFormValidation from '../../hooks/useFormValidation';
import MemoizedBankCard from '../../components/MemoizedBankCard';
import RefDemo from '../../components/RefDemo';
import IframeEmbed from '../../components/IframeDemo';

/**
 * Demo Component - Showcases React Patterns
 * 
 * This page demonstrates various React patterns for code reusability:
 * - Portals (Modal rendering outside DOM hierarchy)
 * - ErrorBoundary (Error handling)
 * - Render Props (DataFetcher component)
 * - Higher-Order Components (withAuth HOC)
 * - Custom Hooks (useFormValidation)
 * - Memoization (React.memo, useMemo, useCallback)
 */

// Sample data for demonstration
const sampleBanks = [
  {
    id: 1,
    BankName: "Demo Bank A",
    InterestRate: 3.5,
    MaximumLoan: 500000,
    MinimumDownPayment: 50000,
    LoanTerm: 30
  },
  {
    id: 2,
    BankName: "Demo Bank B", 
    InterestRate: 4.2,
    MaximumLoan: 750000,
    MinimumDownPayment: 75000,
    LoanTerm: 25
  }
];

// Mock async function for DataFetcher
const mockFetchBanks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleBanks);
    }, 1000);
  });
};

// Component that will be wrapped with HOC
const ProtectedContent = ({ isAuthenticated, logout }) => (
  <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
    <Typography variant="h6" color="white">
      🔐 Protected Content (HOC Demo)
    </Typography>
    <Typography variant="body2" color="white" sx={{ mb: 1 }}>
      This content is only visible when authenticated
    </Typography>
    <Button variant="contained" size="small" onClick={logout}>
      Logout
    </Button>
  </Box>
);

// Wrap with HOC
const ProtectedComponent = withAuth(ProtectedContent);

// Form validation rules
const validationRules = {
  email: {
    required: 'Email is required',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Please enter a valid email address'
  },
  password: {
    required: 'Password is required',
    minLength: 6,
    minLengthMessage: 'Password must be at least 6 characters'
  },
  confirmPassword: {
    required: 'Please confirm your password',
    custom: (value, values) => {
      if (value !== values.password) {
        return 'Passwords do not match';
      }
      return null;
    }
  }
};

const PatternsDemo = () => {
  const [showPortal, setShowPortal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [triggerError, setTriggerError] = useState(false);

  // Custom hook for form validation
  const {
    values,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormValidation(
    { email: '', password: '', confirmPassword: '' },
    validationRules
  );

  // Trigger error for ErrorBoundary demo
  if (triggerError) {
    throw new Error('This is a demo error triggered by the user!');
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        React Patterns Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page demonstrates various React patterns for code reusability and maintainability.
      </Typography>

      <Grid container spacing={3}>
        {/* ErrorBoundary Demo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🛡️ ErrorBoundary Demo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              ErrorBoundary catches JavaScript errors anywhere in the child component tree.
            </Typography>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => setTriggerError(true)}
            >
              Trigger Error
            </Button>
          </Paper>
        </Grid>

        {/* Portal Demo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚪 Portal Demo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Portals render content outside the normal DOM hierarchy.
            </Typography>
            <Button 
              variant="contained"
              onClick={() => setShowPortal(true)}
            >
              Open Portal Modal
            </Button>
          </Paper>
        </Grid>

        {/* HOC Demo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔄 Higher-Order Component Demo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              HOCs wrap components with additional functionality.
            </Typography>
            <ProtectedComponent />
          </Paper>
        </Grid>

        {/* Custom Hook Demo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎣 Custom Hook Demo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Custom hooks encapsulate reusable logic.
            </Typography>
            <form onSubmit={handleSubmit((formData) => {
              alert('Form submitted: ' + JSON.stringify(formData, null, 2));
            })}>
              <TextField
                fullWidth
                label="Email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={!!errors.email}
                helperText={errors.email}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={!!errors.password}
                helperText={errors.password}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={values.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={!isValid}
              >
                Submit Form
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Render Props Demo */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎭 Render Props Demo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Render props pattern shares behavior through a prop that receives a function.
            </Typography>
            <DataFetcher fetchFunction={mockFetchBanks}>
              {({ data, loading, error, refetch }) => (
                <Box>
                  {loading && <Typography>Loading banks...</Typography>}
                  {error && <Alert severity="error">{error}</Alert>}
                  {data && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Fetched {data.length} banks using render props pattern
                      </Typography>
                      <Button variant="outlined" onClick={refetch} sx={{ mb: 2 }}>
                        Refetch Data
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </DataFetcher>
          </Paper>
        </Grid>

        {/* Memoization Demo */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              ⚡ Memoization Demo
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Memoization prevents unnecessary re-renders and optimizes expensive calculations.
            </Typography>
            <Grid container spacing={2}>
              {sampleBanks.map(bank => (
                <Grid item xs={12} sm={6} md={4} key={bank.id}>
                  <MemoizedBankCard
                    bank={bank}
                    onSelect={setSelectedBank}
                    isSelected={selectedBank === bank.id}
                  />
                </Grid>
              ))}
            </Grid>
            {selectedBank && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Selected bank ID: {selectedBank}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* External Website Embed */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🌐 External Website Embed
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Embed external websites like Facebook, GitHub, and currency exchange rates safely.
            </Typography>
            <IframeEmbed />
          </Paper>
        </Grid>

        {/* Refs Demo */}
        <Grid item xs={12}>
          <RefDemo />
        </Grid>
      </Grid>

      {/* Portal Modal */}
      {showPortal && (
        <Portal>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300
            }}
            onClick={() => setShowPortal(false)}
          >
            <Card sx={{ maxWidth: 400, m: 2 }} onClick={(e) => e.stopPropagation()}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portal Modal
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  This modal is rendered using React Portal, which renders content outside the normal DOM hierarchy.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setShowPortal(false)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Portal>
      )}
    </Box>
  );
};

export default PatternsDemo; 