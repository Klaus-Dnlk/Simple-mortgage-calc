import * as React from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { banksOperations, banksSelectors } from '../../redux/banks';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import numeral from 'numeral';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


function Calc() {  
  
  const [initialLoan, setInitialLoan] = React.useState('')
  const [downPayment, setDownPayment] = React.useState('')
  const [loanTerm, setLoanTerm] = React.useState('')
  const [loanApr, setLoanApr] = React.useState('')
  const [monthPayment, setMonthPayment] = React.useState('0.0')
  // const [banks, setBanks] = React.useState('')
  const banks = useSelector(banksSelectors.getAllBanks);
  const dispatch = useDispatch();
  const isLoading = useSelector(banksSelectors.getLoading);

  const [value, setValue] = React.useState('')

  const filinForm = () => {
    if(banks.BankName.find(value)) {
      setInitialLoan(banks.initialLoan)
      setDownPayment('')
      setLoanTerm('')
      setLoanApr('')
    }
  }

  

  
  console.log('value:', value);
  console.log('banks:', banks);

  useEffect(() => {
    dispatch(banksOperations.fetchBanks());
  }, [dispatch]);


  const submitCalc = (e) => {
    e.preventDefault()
    
    const calculateValues = () => {      
      let principal = initialLoan
      let monthlyInterest = loanApr / 100 / 12
      let monthPayment = ((principal * monthlyInterest) * Math.pow((1  + monthlyInterest), loanTerm*12))/(Math.pow(1 + monthlyInterest, loanTerm*12) - 1)
      setMonthPayment(monthPayment)     
    }
    calculateValues()    
  }

  const filingForm = (value) => {
    const foundEl = banks.find(el => el.BankName === value) 
    const indexEl = banks.indexOf(foundEl)
    setInitialLoan(foundEl.MaximumLoan)
    setDownPayment(foundEl.MinimumDownPayment)
    setLoanTerm(foundEl.LoanTerm)
    setLoanApr(foundEl.InterestRate)
    
    
    console.log('foundElement:', foundEl);
    console.log('indexOfElement:', indexEl);
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    filingForm(e.target.value)
  }

  const reset = (e) => {    
    setInitialLoan('')
    setDownPayment('')
    setLoanTerm('')
    setLoanApr('')
    setMonthPayment('')
    setValue('')
  }  

  return (
  <Box>

    <Box sx={{ m: 5 }}>

     <FormControl fullWidth sx={{ mb: 5 }}>
        <InputLabel id="selectBank">Bank name</InputLabel>
        <Select

          labelId="selectBank"
          id="demo-simple-select"
          value={value}
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
              onChange={(e) => setDownPayment(e.target.value)}
              type="text"
            />
        </FormControl>

        <FormControl>
          <InputLabel>Loan Term (y)</InputLabel>
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
      
      <Box sx={{ display: 'flex', mx: 'auto', mt: 3, width: 200 }}>
        <Button
            variant='contained'
            type="submit"
            sx={{ ml: 3, height: 50 }}
            onClick={(e) => submitCalc(e)}
        >
            Calculate
        </Button>

        <Tooltip title="clear">
          <IconButton>
            <DeleteIcon onClick={reset}/>
          </IconButton>
        </Tooltip>
      </Box>
      
    </Box>

    <Box sx={{ display: 'flex',  mx: 'auto' }}>
          <Paper elevation={3} sx={{ display: 'flex',  mx: 'auto', width: 600, height: 128 }}>
            <Typography sx={{ display: 'flex', mx: 'auto', my: 'auto', fontSize: 22 }}>
               Your monthly mortgage payment {numeral(monthPayment).format('$0,0.00')}</Typography>
          </Paper>
    </Box>
  </Box>
  );
}


export default Calc