import styles from './delete-building.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ViewBuilding } from '@fnt-flsy/data-transfer-types';


export interface DeleteBuildingProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  buildingData: ViewBuilding | null;
}

const DeleteBuildingComponent: React.FC<DeleteBuildingProps> = ({

  open,
  onClose,
  onDelete,
  buildingData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
          <Box className={styles['modal-container']}>
            <h2 className={styles['h2_tag']}>Delete Building</h2>
            <p>Are you sure you want to delete building <b>{buildingData?.name}</b> ?</p>
            <Box className={styles['modal-buttons']}>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
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
}

export default DeleteBuildingComponent;
