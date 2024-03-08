
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
        <h2 className={styles['h2_tag']}>Remove Device</h2>
        <p>Are you sure you want to Remove this Device?</p>
        <Box>
         
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ ml: "10px" }}
            className={styles['delete_btn']}
            variant="contained"
            color="primary"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteControllerComponent;

