import styles from './delete-resident.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


export interface DeleteResidentProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  residentData: EditForm | null;
}


interface EditForm {
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  buildingId: number;
  floorId: number;
  flatId: number;
  isActive: boolean;

  flats: [
    {
      type: string;
      isPrimary:boolean;
      flat: {
        id: number,
        number: string;

        floor: {
          id: number;
          number: string;

          building: {
            id: number;
            name: string;
            society: { id: number; name: string };
          }
        }
      }
    }]
};

const DeleteResidentComponent: React.FC<DeleteResidentProps> = ({
  open,
  onClose,
  onDelete,
  residentData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>Delete Resident</h2>
        <p>Are you sure you want to delete <b>{residentData?.name}</b>?</p>
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

export default DeleteResidentComponent;
