import React, { useState }  from 'react'
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Input, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { getAllBanks } from '../../redux/banks/banks-selectors'
import banksOperations from '../../redux/banks/banks-operations';
import { openDB } from 'idb';

const validationSchema = yup.object({
    BankName: yup.string().matches(/^[A-Z]/, 'capital letter').required('Bank name is required'),
    MaximumLoan: yup.number().positive('positive number').required('Maximum loan is required'),
    MinimumDownPayment: yup.number().positive('positive number').required('Minimum down payment is required'),
    LoanTerm: yup.number().positive('positive number').required('Loan term is required'),
    InterestRate: yup.number().positive('positive number').required('Interest rate is required'),
  });

function NewBankCard({ onCloseModal }) {

    const [BankName, setName] = useState('')
    const [MaximumLoan, setLoan] = useState('')
    const [MinimumDownPayment, setDwnPay] = useState('')
    const [LoanTerm, setTerm] = useState('')
    const [InterestRate, setRate] = useState('')    

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

    const handleSubmit = async e => {
        e.preventDefault()

        const repeatName = name => 
        banks.find(e => e.BankName.toLowerCase() === name.toLowerCase())
        try {
            await validationSchema.validate({ BankName, MaximumLoan, MinimumDownPayment, LoanTerm, InterestRate }, { abortEarly: false });

                if(repeatName(BankName)) {
                    alert(`${BankName} is already exist`)
                } else {
                    const newBank = { BankName, MaximumLoan, MinimumDownPayment, LoanTerm, InterestRate };

                    dispatch(banksOperations.addNewBank({ BankName, MaximumLoan, MinimumDownPayment, LoanTerm, InterestRate }))
                    await saveToIndexedDB(newBank)
                    onCloseModal(false)
                    reset()
                }
            } catch (error) {
                if (error instanceof yup.ValidationError) {
                    alert(error.errors[0]);
                }
        }
    }

    const saveToIndexedDB = async (newBank) => {
        const db = await openDB('banksDB', 1, {
            upgrade(db) {
                if(!db.objectStoreNames.contains('banks')) {
                    db.createObjectStore('banks', { keyPath: 'BankName' });
                }
            },
        });

        await db.put('banks', newBank);
    };

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
                <InputLabel htmlFor={bankId}>Bank name</InputLabel>
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
                onChange={handleChange} 
                />
                
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">Minimum down payment ($)</InputLabel>
                <Input 
                type='text'
                name='MinimumDownPayment'
                value={MinimumDownPayment}
                onChange={handleChange} 
                />
                
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">Loan term ($)</InputLabel>
                <Input 
                type='text'
                name='LoanTerm'
                value={LoanTerm}
                onChange={handleChange} 
                />
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
                <InputLabel htmlFor="my-input">EInterest rate (%)</InputLabel>
                <Input 
                type='text'
                name='InterestRate'
                value={InterestRate}
                onChange={handleChange} 
                />
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