import React from 'react'
import {
  Divider,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({ open, handleClose, title, description, handleConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant='subtitle1' >
          {title}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>
          {description}
        </Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button size='small' onClick={handleClose}>Cancel</Button>
        <Button size='small' variant='contained' onClick={handleConfirm} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func.isRequired
}

export default ConfirmationDialog