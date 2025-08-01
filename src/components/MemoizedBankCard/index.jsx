import React, { useMemo, useCallback } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

// MemoizedBankCard Component - Demonstrates Memoization Techniques
// This component shows how to use React.memo, useMemo, and useCallback to optimize performance
// by preventing unnecessary re-renders and recalculations
// 
// Benefirs:
// - Prevents unnecessary re-renders when props haven't changed
// - Optimizes expensive calculations
// - Improves overall application performance
// 

const MemoizedBankCard = React.memo(({ bank, onSelect, isSelected }) => {
  // useMemo for expensive calculations that depend on bank data
  const calculatedValues = useMemo(() => {
    const { InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm } = bank;
    
    // Simulate expensive calculations
    const monthlyPayment = (MaximumLoan - MinimumDownPayment) * 
      (InterestRate / 100 / 12) * 
      Math.pow(1 + InterestRate / 100 / 12, LoanTerm * 12) / 
      (Math.pow(1 + InterestRate / 100 / 12, LoanTerm * 12) - 1);
    
    const totalInterest = (monthlyPayment * LoanTerm * 12) - (MaximumLoan - MinimumDownPayment);
    const downPaymentPercentage = (MinimumDownPayment / MaximumLoan) * 100;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      downPaymentPercentage: Math.round(downPaymentPercentage)
    };
  }, [bank.InterestRate, bank.MaximumLoan, bank.MinimumDownPayment, bank.LoanTerm]);

  // useCallback for event handlers to prevent child re-renders
  const handleSelect = useCallback(() => {
    onSelect(bank.id);
  }, [onSelect, bank.id]);

  // useMemo for complex JSX that depends on calculated values
  const cardContent = useMemo(() => (
    <CardContent>
      <Typography variant="h6" component="h2" gutterBottom>
        {bank.BankName}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Interest Rate: <strong>{bank.InterestRate}%</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Max Loan: <strong>${bank.MaximumLoan.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Min Down Payment: <strong>${bank.MinimumDownPayment.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loan Term: <strong>{bank.LoanTerm} years</strong>
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Calculated Values:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monthly Payment: <strong>${calculatedValues.monthlyPayment.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Interest: <strong>${calculatedValues.totalInterest.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Down Payment %: <strong>{calculatedValues.downPaymentPercentage}%</strong>
        </Typography>
      </Box>

      <Chip 
        label={isSelected ? "Selected" : "Select Bank"} 
        color={isSelected ? "primary" : "default"}
        variant={isSelected ? "filled" : "outlined"}
        onClick={handleSelect}
        sx={{ cursor: 'pointer' }}
      />
    </CardContent>
  ), [bank.BankName, bank.InterestRate, bank.MaximumLoan, bank.MinimumDownPayment, bank.LoanTerm, calculatedValues, isSelected, handleSelect]);

  return (
    <Card 
      sx={{ 
        m: 1, 
        cursor: 'pointer',
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={handleSelect}
    >
      {cardContent}
    </Card>
  );
});

// Set display name for better debugging
MemoizedBankCard.displayName = 'MemoizedBankCard';

export default MemoizedBankCard; 