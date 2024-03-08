import styles from './delete-society.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { AddSociety } from '@fnt-flsy/data-transfer-types';


export interface DeleteSocietyProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  societyData: AddSociety | null;
}

const DeleteSocietyComponent: React.FC<DeleteSocietyProps> = ({
  open,
  onClose,
  onDelete,
  societyData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['edit_modal_container']}>
        <h2 className={styles['h2_tag']}>Delete Society</h2>
        <p>Are you sure you want to delete <b>{societyData?.name}</b> society?</p>
        <Box className={styles['modal-buttons']}>
         
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
          className={styles['delete_btn']}
            variant="contained"
            color="error"
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
}

export default DeleteSocietyComponent;
