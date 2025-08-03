import React from 'react';
import { useSelector } from 'react-redux';
import { banksSelectors } from '../../redux/banks';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  TrendingUp as RateIcon,
  Schedule as TermIcon,
  AttachMoney as LoanIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

const BanksStatistics = () => {
  const statistics = useSelector(banksSelectors.getBanksStatistics);
  const banks = useSelector(banksSelectors.getAllBanks);

  if (!banks || banks.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            No banks data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      title: 'Total Banks',
      value: statistics.totalBanks,
      icon: <BankIcon />,
      color: 'primary'
    },
    {
      title: 'Avg Interest Rate',
      value: `${statistics.averageInterestRate}%`,
      icon: <RateIcon />,
      color: 'success'
    },
    {
      title: 'Avg Loan Term',
      value: `${statistics.averageLoanTerm} years`,
      icon: <TermIcon />,
      color: 'info'
    },
    {
      title: 'Avg Max Loan',
      value: `$${statistics.averageMaxLoan.toLocaleString()}`,
      icon: <LoanIcon />,
      color: 'warning'
    },
    {
      title: 'Avg Min Down Payment',
      value: `$${statistics.averageMinDownPayment.toLocaleString()}`,
      icon: <PaymentIcon />,
      color: 'secondary'
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Banks Statistics
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Calculated using Immutable.js for optimal performance
        </Typography>
        
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {statItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ mr: 1, color: `${item.color}.main` }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    {item.title}
                  </Typography>
                  <Typography variant="h6" color="textPrimary">
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Chip
            label="Powered by Immutable.js"
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BanksStatistics; 