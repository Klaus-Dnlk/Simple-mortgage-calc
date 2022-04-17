import * as React from 'react'
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Input, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getAllBanks } from '../../redux/banks/banks-selectors'
import banksOperations from '../../redux/banks/banks-operations';

function NewBankCard() {

    const [BankName, setName] = React.useState('')
    const [MaximumLoan, setLoan] = React.useState('')
    const [MinimumDownPayment, setDwnPay] = React.useState('')
    const [LoanTerm, setTerm] = React.useState('')
    const [InterestRate, setRate] = React.useState('')    

    const banks = useSelector(getAllBanks)
    const dispatch = useDispatch()
    const bankId = uuidv4()

    const handleChange = e => {
        const { name, value } = e.target

        switch (name) {
            case 'BankName':
                setName(value)
                break;
            case 'MaximumLoan':
                setLoan(value)
                break;
            case 'MinimumDownPayment':
                setDwnPay(value)
                break;
            case 'LoanTerm':
                setTerm(value)
                break;
            case 'InterestRate':
                setRate(value)
                break;
            default:
                break;
            }
        }    

    const handleSubmit = e => {
        e.preventDefault()

        const repeatName = name => 
        banks.find(e => e.BankName.toLowerCase() === name.toLowerCase())

        if(repeatName(BankName)) {
            alert(`${BankName} is already exist`)
        } else {
            dispatch(banksOperations.addNewBank({ BankName, MaximumLoan, MinimumDownPayment, LoanTerm, InterestRate }))

        }
        reset()
    }

    const reset  = () => {
        setName('')
        setLoan('')
        setDwnPay('')
        setTerm('')
        setRate('')
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">Bank name</InputLabel>
                <Input 
                type='text'
                name='BankName'
                value={BankName}
                onChange={handleChange}
                id={bankId}
                />
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">Maximum loan ($)</InputLabel>
                <Input 
                type='text'
                name='MaximumLoan'
                value={MaximumLoan}
                onChange={handleChange} />
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">Minimum down payment ($)</InputLabel>
                <Input 
                type='text'
                name='MinimumDownPayment'
                value={MinimumDownPayment}
                onChange={handleChange} />
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">Loan term ($)</InputLabel>
                <Input 
                type='text'
                name='LoanTerm'
                value={LoanTerm}
                onChange={handleChange} />
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">EInterest rate (%)</InputLabel>
                <Input 
                type='text'
                name='InterestRate'
                value={InterestRate}
                onChange={handleChange} />
            </FormControl>
            <Button 
                variant='contained'
                type="submit"
                sx={{ mt: 2, mx: 'auto', width: 300,  height: 50 }}
                onClick={handleSubmit}
            >
             Add Bank   
            </Button>
          
        </Box>
    )
}


export default NewBankCard