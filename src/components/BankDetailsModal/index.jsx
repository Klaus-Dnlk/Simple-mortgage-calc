import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Portal from '../Portal';

const BankDetailsModal = ({ bank, isOpen, onClose }) => {
  if (!isOpen || !bank) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate) => {
    return `${rate}%`;
  };

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1400,
          p: 2
        }}
        onClick={onClose}
      >
        <Card
          sx={{
            maxWidth: 600,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" component="h2" fontWeight="bold">
              🏦 {bank.BankName}
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'text.primary',
                  bgcolor: 'action.hover'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Interest Rate Highlight */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Chip
                label={`Interest Rate: ${formatPercentage(bank.InterestRate)}`}
                color="primary"
                size="large"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  py: 1,
                  px: 2
                }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Bank Details Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h6" color="white" gutterBottom>
                    Maximum Loan
                  </Typography>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {formatCurrency(bank.MaximumLoan)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <Typography variant="h6" color="white" gutterBottom>
                    Minimum Down Payment
                  </Typography>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {formatCurrency(bank.MinimumDownPayment)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                  <Typography variant="h6" color="white" gutterBottom>
                    Loan Term
                  </Typography>
                  <Typography variant="h4" color="white" fontWeight="bold">
                    {bank.LoanTerm} Years
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Additional Information */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                📊 Loan Analysis
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Down Payment Percentage:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {((bank.MinimumDownPayment / bank.MaximumLoan) * 100).toFixed(1)}%
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Payment (Est.):
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(
                      (bank.MaximumLoan * (bank.InterestRate / 100 / 12) * Math.pow(1 + bank.InterestRate / 100 / 12, bank.LoanTerm * 12)) /
                      (Math.pow(1 + bank.InterestRate / 100 / 12, bank.LoanTerm * 12) - 1)
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{ minWidth: 120 }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  // Here you could add logic to select this bank
                  alert(`Selected ${bank.BankName} for mortgage calculation`);
                  onClose();
                }}
                sx={{ minWidth: 120 }}
              >
                Select Bank
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Portal>
  );
};

export default BankDetailsModal; 