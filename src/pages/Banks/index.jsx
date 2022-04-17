import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { banksOperations, banksSelectors } from '../../redux/banks';
import AddBankModal from '../Modal';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

// DEL BUTTON
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import { Typography } from '@mui/material';


function Banks() {
  const banks = useSelector(banksSelectors.getAllBanks);
  const dispatch = useDispatch();
  const isLoading = useSelector(banksSelectors.getLoading);

  const [showModal, setShowModal] = React.useState(false)



  useEffect(() => {
    dispatch(banksOperations.fetchBanks());
  }, [dispatch]);

  const handleOpen = () => {
    if(!showModal) {
      setShowModal(true)
      
    } else {
      setShowModal(false)
    }      
   };

  return (
        <>
        <IconButton sx={{ m:2 }} 

          onClick={handleOpen}>
          <AddCircleOutlineIcon color="primary"/>
          <Typography color='primary'>Add new Bank</Typography>
        </IconButton>
          {showModal && <AddBankModal />}
          {isLoading && 
              <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
            }  

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ border: 2 }}>
              <TableRow >
                <TableCell sx={{ fontWeight: 'bold' }}>Bank name</TableCell>
                <TableCell  sx={{ fontWeight: 'bold' }} align="right" >Interest rate&nbsp;(%)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Maximum loan&nbsp;($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Minimum down payment&nbsp;($)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Loan term&nbsp;(m)</TableCell>
              </TableRow>
            </TableHead>
            
            {banks.length > 0 && (
              <TableBody>
                {banks.map(({ id, BankName, InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm }) => (
                  <TableRow
                  key={id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                  <TableCell component="th" scope="e">
                    {BankName}
                  </TableCell>
                  <TableCell align="right">{InterestRate}</TableCell>
                  <TableCell align="right">{MaximumLoan}</TableCell>
                  <TableCell align="right">{MinimumDownPayment}</TableCell>
                  <TableCell align="right">{LoanTerm}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => dispatch(banksOperations.deleteBank(id))}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            )}
          </Table>
        </TableContainer>
        </>
      )
}

export default Banks