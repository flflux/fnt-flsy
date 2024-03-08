
import styles from './delete-modal.module.scss';

import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export interface DeleteControllerProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}


const DeleteControllerComponent: React.FC<DeleteControllerProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2>Delete Controller</h2>
        <p>Are you sure you want to delete this Controller?</p>
        <Box>
          <Button
            sx={{ mr: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteControllerComponent;

