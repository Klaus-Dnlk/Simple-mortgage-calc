import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import NewBankCard from '../../components/BankCard/index'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 400,

  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

function AddModal({ onClose, title, children }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);

  return (
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h3" sx={{ textAlign: 'center' }}>
            {title}
          </Typography>
          {children}
          
        </Box>
      </Modal>
  );
}


export default AddModal