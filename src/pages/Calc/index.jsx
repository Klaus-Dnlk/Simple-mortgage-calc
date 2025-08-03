import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  OutlinedInput, 
  InputLabel, 
  FormControl, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  MenuItem, 
  Select,
  Alert,
  Grid,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { isEmpty, isNumber, clamp, round } from 'lodash';

import { banksOperations, banksSelectors } from '../../redux/banks';
import { useSelector, useDispatch } from 'react-redux';
import numeral from 'numeral';
import { generateMortgageReport, savePDF } from '../../utils/pdf-utils';

const calculateMonthlyPayment = (principal, annualRate, years) => {
  if (!isNumber(principal) || !isNumber(annualRate) || !isNumber(years)) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numberOfPayments;
  
  const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
         (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return round(payment, 2);
};

function Calc() {  
  const banks = useSelector(banksSelectors.getAllBanks);
  const isLoading = useSelector(banksSelectors.getLoading);
  const error = useSelector(banksSelectors.getError);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    initialLoan: '',
    downPayment: '',
    loanTerm: '',
    loanApr: ''
  });
  const [monthPayment, setMonthPayment] = useState(0);
  const [bankValue, setBankValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    dispatch(banksOperations.fetchBanks());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setValidationError('');
    setWarning('');
  };

  const handleBankChange = (e) => {
    const selectedBankName = e.target.value;
    setBankValue(selectedBankName);
    
    const selectedBank = banks.find(bank => bank.BankName === selectedBankName);
    if (selectedBank) {
      setFormData({
        initialLoan: selectedBank.MaximumLoan.toString(),
        downPayment: selectedBank.MinimumDownPayment.toString(),
        loanTerm: selectedBank.LoanTerm.toString(),
        loanApr: selectedBank.InterestRate.toString()
      });
    }
  };

  const validateForm = () => {
    const { loanApr, initialLoan, downPayment, loanTerm } = formData;
    
    if (isEmpty(initialLoan) || isEmpty(downPayment) || isEmpty(loanTerm) || isEmpty(loanApr)) {
      setValidationError('All fields are required');
      return false;
    }
    
    const apr = parseFloat(loanApr);
    const loan = parseFloat(initialLoan);
    const down = parseFloat(downPayment);
    const term = parseFloat(loanTerm);
    
    if (!isNumber(apr) || apr > 100 || apr < 0) {
      setValidationError('Interest rate must be between 0 and 100%');
      return false;
    }
    
    if (!isNumber(loan) || loan <= 0) {
      setValidationError('Initial loan must be greater than 0');
      return false;
    }
    
    if (!isNumber(down) || down < 0) {
      setValidationError('Down payment cannot be negative');
      return false;
    }
    
    if (!isNumber(term) || term <= 0) {
      setValidationError('Loan term must be greater than 0');
      return false;
    }
    
    if (apr > 15) {
      setWarning('Consider negotiating for a better rate');
    }
    
    return true;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { initialLoan, loanApr, loanTerm } = formData;
    const payment = calculateMonthlyPayment(
      parseFloat(initialLoan),
      parseFloat(loanApr),
      parseFloat(loanTerm)
    );
    
    setMonthPayment(payment);
  };

  const handleReset = () => {    
    setFormData({
      initialLoan: '',
      downPayment: '',
      loanTerm: '',
      loanApr: ''
    });
    setMonthPayment(0);
    setBankValue('');
    setValidationError('');
    setWarning('');
  };

  // Export calculation to PDF
  const handleExportPDF = () => {
    if (monthPayment <= 0) {
      setValidationError('Please calculate a payment first');
      return;
    }

    const selectedBank = banks.find(bank => bank.BankName === bankValue);
    if (!selectedBank) {
      setValidationError('Please select a bank first');
      return;
    }

    const calculationData = {
      loanAmount: parseFloat(formData.initialLoan),
      downPayment: parseFloat(formData.downPayment),
      downPaymentPercentage: (parseFloat(formData.downPayment) / parseFloat(formData.initialLoan)) * 100,
      monthlyPayment: monthPayment,
      totalPayment: monthPayment * parseFloat(formData.loanTerm) * 12,
      totalInterest: (monthPayment * parseFloat(formData.loanTerm) * 12) - parseFloat(formData.initialLoan)
    };

    const bankData = {
      name: selectedBank.BankName,
      interestRate: selectedBank.InterestRate,
      maxLoan: selectedBank.MaximumLoan,
      minDownPayment: selectedBank.MinimumDownPayment,
      loanTerm: selectedBank.LoanTerm
    };

    const doc = generateMortgageReport(calculationData, bankData);
    savePDF(doc, `mortgage-calculation-${new Date().toISOString().split('T')[0]}.pdf`);
  };  

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading banks...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity="error">Failed to load banks: {error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Mortgage Calculator
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="selectBank">Bank name</InputLabel>
            <Select
              labelId="selectBank"
              value={bankValue}
              label="Bank name"
              onChange={handleBankChange}
            >
              {banks.map(({ id, BankName }) => (
                <MenuItem key={id} value={BankName}>{BankName}</MenuItem>  
              ))}
            </Select>
          </FormControl>
          
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationError}
            </Alert>
          )}
          
          {warning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {warning}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Initial Loan ($)</InputLabel>
                <OutlinedInput 
                  value={formData.initialLoan}
                  onChange={(e) => handleInputChange('initialLoan', e.target.value)}
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Down Payment ($)</InputLabel>
                <OutlinedInput 
                  value={formData.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Loan Term (years)</InputLabel>
                <OutlinedInput 
                  value={formData.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>APR (%)</InputLabel>
                <OutlinedInput 
                  value={formData.loanApr}
                  onChange={(e) => handleInputChange('loanApr', e.target.value)}
                  type="number"
                />
              </FormControl>
            </Grid>
          </Grid>
          
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button 
              variant='contained' 
              onClick={handleCalculate}
              size="large"
            >
              Calculate
            </Button>
            <Tooltip title="Clear form">
              <IconButton onClick={handleReset} data-testid="reset">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {monthPayment > 0 && (
              <Tooltip title="Export to PDF">
                <IconButton 
                  onClick={handleExportPDF}
                  color="primary"
                  data-testid="export-pdf"
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', minHeight: 200 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Payment
            </Typography>
            <Typography 
              variant="h4" 
              color="primary" 
              data-testid="monthly-payment"
              sx={{ fontWeight: 'bold' }}
            >
              {numeral(monthPayment).format('$0,0.00')}
            </Typography>
            {monthPayment > 0 && (
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Total payments: {numeral(monthPayment * parseFloat(formData.loanTerm || 0) * 12).format('$0,0.00')}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Calc