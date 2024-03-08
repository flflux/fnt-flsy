import styles from './delete-all-building.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

/* eslint-disable-next-line */
export interface DeleteAllBuildingProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteAllBuilding({
  open,
  onClose,
  onDelete,
}: DeleteAllBuildingProps) {
  return (
    <Modal open={open} onClose={onClose}>
          <Box className={styles['modal-container']}>
            <h2 className={styles['h2_tag']}>Delete Building</h2>
            <p>Are you sure you want to delete All the selected building?</p>
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

export default DeleteAllBuilding;
