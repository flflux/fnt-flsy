import styles from './add-building.module.scss';
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddBuilding } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog } from '@mui/material';


export interface AddBuildingProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddBuilding) => void;
}

const AddBuildingComponent: React.FC<AddBuildingProps> = ({ open, onClose, onSubmit }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });
  const { handleSubmit, control, reset, formState: { errors } } = useForm<AddBuilding>({
    resolver: yupResolver(validationSchema)
  });

  const handleFormSubmit = (data: AddBuilding) => {
    onSubmit(data);
  };

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);
  return (
    <Modal  open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Building</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                className="form-control"
                placeholder="Enter Building Name"
                {...field}
                label="Name*"
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ margin: '10px' }}
              />
            )}
          />
          <Box className={styles['update_modal-buttons']}>
            <Button variant="contained" color="primary" type="submit">
               Add
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default AddBuildingComponent;
