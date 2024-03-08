import styles from './delete-resident.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


export interface DeleteResidentProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteResidentComponent: React.FC<DeleteResidentProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2>Delete Resident</h2>
        <p>Are you sure you want to delete this resident?</p>
        <Box className={styles['modal-buttons']}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Confirm
          </Button>
          <Button variant="contained" color="inherit" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteResidentComponent;
