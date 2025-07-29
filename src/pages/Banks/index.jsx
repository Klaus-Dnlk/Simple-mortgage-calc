import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { banksOperations, banksSelectors } from '../../redux/banks';
import AddBankModal from '../Modal';

import {
  Box,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  CircularProgress,
  DeleteIcon,
  IconButton,
  AddCircleOutlineIcon,
  Tooltip,
  Typography,
  Alert,
  Button
} from '@mui/material';

function Banks() {
  const banks = useSelector(banksSelectors.getAllBanks);
  const isLoading = useSelector(banksSelectors.getLoading);
  const error = useSelector(banksSelectors.getError);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    dispatch(banksOperations.fetchBanks());
  }, [dispatch]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteBank = (bankId) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      dispatch(banksOperations.deleteBank(bankId));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Banks Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenModal}
          size="large"
        >
          Add New Bank
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load banks: {error}
        </Alert>
      )}

      {showModal && (
        <AddBankModal onCloseModal={handleCloseModal} />
      )}

      {banks.length === 0 && !isLoading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No banks found. Add your first bank to get started.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 650 }} aria-label="banks table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                  Bank Name
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  Interest Rate (%)
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  Maximum Loan ($)
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  Minimum Down Payment ($)
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  Loan Term (years)
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {banks.map(({ id, BankName, InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm }) => (
                <TableRow
                  key={id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                    {BankName}
                  </TableCell>
                  <TableCell align="right">{InterestRate}%</TableCell>
                  <TableCell align="right">${MaximumLoan.toLocaleString()}</TableCell>
                  <TableCell align="right">${MinimumDownPayment.toLocaleString()}</TableCell>
                  <TableCell align="right">{LoanTerm} years</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete bank">
                      <IconButton 
                        onClick={() => handleDeleteBank(id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Banks;