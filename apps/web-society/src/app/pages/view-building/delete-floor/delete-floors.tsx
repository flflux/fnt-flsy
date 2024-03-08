import styles from './delete-floors.module.scss';

import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ViewFloor } from '@fnt-flsy/data-transfer-types';

export interface DeleteFloorProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  floorData: ViewFloor | null;
}


const DeleteFloorComponent: React.FC<DeleteFloorProps> = ({
  open,
  onClose,
  onDelete,
floorData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>Delete Floor</h2>
        <p>Are you sure you want to delete floor <b>{floorData?.number}</b>?</p>
        <Box>
         
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
          className={styles['delete_btn']}
            sx={{ ml: "10px" }}
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

export default DeleteFloorComponent;

