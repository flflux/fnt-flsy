import styles from './delete-flats.module.scss';

import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ViewFlat } from '@fnt-flsy/data-transfer-types';

export interface DeleteFlatProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  flatData: ViewFlat | null;
}


const DeleteFlatComponent: React.FC<DeleteFlatProps> = ({
  open,
  onClose,
  onDelete,
  flatData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>Delete Flat</h2>
        <p>Are you sure you want to delete flat <b>{flatData?.number}</b>?</p>
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

export default DeleteFlatComponent;


