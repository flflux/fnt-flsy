import styles from './delete-vehicle.module.scss';
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface DeleteVehicleProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  Status: boolean | undefined ;
  vehicleData: ViewVehicle | null;
}

interface ViewVehicle {
  id:number;
  name: string;
  number: string;
  type: string;
  isActive: boolean;
  flats: [
    {
      flats: {
        id: number,
        number: string;

        floor: {
          id: number;
          number: string;

          building: {
            id: number;
            name: string;
            society: {
              id: number;
              name: string
            };
          }
        }
      }
    }];

}

const DeleteVehicleComponent: React.FC<DeleteVehicleProps> = ({
  open,
  onClose,
  onDelete,
  Status,
  vehicleData
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>{Status===true ? 'Deactivate' : 'Activate'} Vehicle</h2>
        <p>Are you sure you want to {Status===true ? 'deactivate' : 'activate'} vehicle <b>{vehicleData?.number}</b>?</p>
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

export default DeleteVehicleComponent;
