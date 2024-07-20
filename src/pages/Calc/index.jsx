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
  Switch
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector, useDispatch } from 'react-redux';
import numeral from 'numeral';
import 'parsleyjs';

import { banksOperations, banksSelectors } from '../../redux/banks';
import CalculatorIframe from '../../components/IframeComponent';



function Calc() {  
  
  const banks = useSelector(banksSelectors.getAllBanks);
  const dispatch = useDispatch();

  const [initialLoan, setInitialLoan] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [loanApr, setLoanApr] = useState('');
  const [monthPayment, setMonthPayment] = useState('0.0');
  const isLoading = useSelector(state => state.banks.isLoading);
  const [bankValue, setBankValue] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isChecked, setIsChecked] = useState(true)


  useEffect(() => {
    dispatch(banksOperations.fetchBanks());
  }, [dispatch]);


  const submitCalc = (e) => {
    e.preventDefault()

    if (loanApr > 100 || loanApr < 0) {
      setError('Invalid interest rate');
      return;
    } else if (loanApr > 15) {
      setWarning('Consider negotiating for a better rate');
    } else {
      setError('');
      setWarning('');
    }
    
    let principal = initialLoan
    let monthlyInterest = loanApr / 100 / 12
    let monthPayment = ((principal * monthlyInterest) * Math.pow((1  + monthlyInterest), loanTerm*12))/(Math.pow(1 + monthlyInterest, loanTerm*12) - 1)
    setMonthPayment(monthPayment)     
        
  }

  const filingForm = (value) => {
    const foundEl = banks.find(el => el.BankName === value) 
    setInitialLoan(foundEl.MaximumLoan)
    setDownPayment(foundEl.MinimumDownPayment)
    setLoanTerm(foundEl.LoanTerm)
    setLoanApr(foundEl.InterestRate)
  }

  const handleChange = (e) => {
    setBankValue(e.target.value)
    filingForm(e.target.value)
  }

  const reset = () => {    
    setInitialLoan('');
    setDownPayment('');
    setLoanTerm('');
    setLoanApr('');
    setMonthPayment('0.0');
    setBankValue('');
    setError('');
    setWarning('');
  }  

  const handleSwitchChange = ( e) => {
    setIsChecked(e.target.checked)
  }

  return (
  <>
    <Switch 
      checked={isChecked} 
      onChange={handleSwitchChange} 
      inputProps={{ 'aria-label': 'controlled' }}
    />
    {!isChecked ? (
      <CalculatorIframe />
    ) : (
          <Box>
          <Box sx={{ m: 5 }}>
          <FormControl fullWidth sx={{ mb: 5 }}>
              <InputLabel id="selectBank">Bank name</InputLabel>
              <Select
                labelId="selectBank"
                id="demo-simple-select"
                value={bankValue}
                label="Bank name"
                onChange={handleChange}>
                  {banks.map(({ id, BankName }) => (
                    <MenuItem key={id} value={BankName}>{BankName}</MenuItem>  
                  ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', mx: 'auto', width: 800 }}>
              <FormControl>
                <InputLabel>Initial Loan</InputLabel>
                <OutlinedInput 
                  value={initialLoan}
                  onChange={(e) => setInitialLoan(e.target.value)}
                  type="text"
                />
              </FormControl>

              <FormControl>
                <InputLabel>Down Payment</InputLabel>
                  <OutlinedInput 
                  value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    type="text"
                  />
              </FormControl>

              <FormControl>
                <InputLabel>Loan Term (m)</InputLabel>
                <OutlinedInput 
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  type="text"
                />
              </FormControl>

              <FormControl>
                <InputLabel>APR (%)</InputLabel>
                <OutlinedInput 
                value={loanApr}
                  onChange={(e) => setLoanApr(e.target.value)}
                  type="text"
                />
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', mx: 'auto', mt: 3, width: 350 }}>
            <Button variant='contained' onClick={submitCalc}>Calculate</Button>
              <Tooltip title="Clear">
                <IconButton onClick={reset} data-testid="reset">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              {error && <Typography data-testid="calc-error">{error}</Typography>}
              {warning && <Typography data-testid="interest-rate-warning">{warning}</Typography>}
              <Typography data-testid="monthly-payment">
                Your monthly mortgage payment {numeral(monthPayment).format('$0,0.00')}
              </Typography>
            </Box>
            
          </Box>

          <Box sx={{ display: 'flex',  mx: 'auto' }}>
                <Paper elevation={3} sx={{ display: 'flex',  mx: 'auto', width: 600, height: 128 }}>
                  <Typography sx={{ display: 'flex', mx: 'auto', my: 'auto', fontSize: 22 }}>
                    Your monthly mortgage payment {numeral(monthPayment).format('$0,0.00')}</Typography>
                </Paper>
          </Box>
        </Box>
    )}
        
  </>
  );
}


export default Calc