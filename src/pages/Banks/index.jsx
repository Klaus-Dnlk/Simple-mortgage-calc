import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { banksOperations, banksSelectors } from '../../redux/banks';
import AddBankModal from '../Modal';
import BankDetailsModal from '../../components/BankDetailsModal';

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
  const intl = useIntl();
  const banks = useSelector(banksSelectors.getAllBanks);
  const isLoading = useSelector(banksSelectors.getLoading);
  const error = useSelector(banksSelectors.getError);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = React.useState(false);
  const [selectedBank, setSelectedBank] = React.useState(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);

  useEffect(() => {
    dispatch(banksOperations.fetchBanks());
  }, [dispatch]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenDetailsModal = (bank) => {
    setSelectedBank(bank);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBank(null);
  };

  const handleDeleteBank = (bankId) => {
    if (window.confirm(intl.formatMessage({ id: 'banks.deleteConfirm' }))) {
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
          {intl.formatMessage({ id: 'banks.title' })}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenModal}
          size="large"
        >
          {intl.formatMessage({ id: 'banks.addBank' })}
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

      {showDetailsModal && selectedBank && (
        <BankDetailsModal
          bank={selectedBank}
          isOpen={showDetailsModal}
          onClose={handleCloseDetailsModal}
        />
      )}

      {banks.length === 0 && !isLoading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {intl.formatMessage({ id: 'banks.noBanks' })}
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="info.contrastText">
              {intl.formatMessage({ id: 'banks.clickHint' })}
            </Typography>
          </Box>
          <Table sx={{ minWidth: 650 }} aria-label="banks table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                  {intl.formatMessage({ id: 'banks.tableHeaders.bankName' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  {intl.formatMessage({ id: 'banks.tableHeaders.interestRate' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  {intl.formatMessage({ id: 'banks.tableHeaders.maxLoan' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  {intl.formatMessage({ id: 'banks.tableHeaders.minDownPayment' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="right">
                  {intl.formatMessage({ id: 'banks.tableHeaders.loanTerm' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white' }} align="center">
                  {intl.formatMessage({ id: 'banks.tableHeaders.actions' })}
                </TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {banks.map(({ id, BankName, InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm }) => (
                <TableRow
                  key={id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpenDetailsModal({ id, BankName, InterestRate, MaximumLoan, MinimumDownPayment, LoanTerm })}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                    {BankName}
                  </TableCell>
                  <TableCell align="right">{InterestRate}%</TableCell>
                  <TableCell align="right">${MaximumLoan.toLocaleString()}</TableCell>
                  <TableCell align="right">${MinimumDownPayment.toLocaleString()}</TableCell>
                  <TableCell align="right">{LoanTerm} years</TableCell>
                  <TableCell align="center">
                    <Tooltip title={intl.formatMessage({ id: 'banks.deleteTooltip' })}>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBank(id);
                        }}
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