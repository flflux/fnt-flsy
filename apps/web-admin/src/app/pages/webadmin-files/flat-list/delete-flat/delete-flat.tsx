import styles from './delete-flat.module.scss';

import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export interface DeleteFlatProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}


const DeleteFlatComponent: React.FC<DeleteFlatProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2>Delete Flat</h2>
        <p>Are you sure you want to delete this flat?</p>
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

export default DeleteFlatComponent;

