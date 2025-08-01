import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import NewBankCard from '../../components/BankCard/index';
import Portal from '../../components/Portal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto',
};

function AddBankModal({ onCloseModal }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    onCloseModal();
  };

  return (
    <Portal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography 
            id="modal-modal-title" 
            variant="h5" 
            component="h2" 
            sx={{ textAlign: 'center', mb: 3 }}
          >
            Add New Bank
          </Typography>
          <NewBankCard onCloseModal={handleClose} />
        </Box>
      </Modal>
    </Portal>
  );
}

export default AddBankModal;