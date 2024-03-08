import styles from './name-edit-controller.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { EditDevice } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import axios from 'axios';

export interface NameEditControllerProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: EditDevice | null;
}

interface Form{
  name:string;
}


const NameEditControllerComponent: React.FC<NameEditControllerProps> = ({ open, onClose, onUpdate, initialData }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
    }
  });


  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: Form) => {
    onUpdate(data);
    onClose();
  };
  const closeModal = () => {
    onClose();
  }



  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>
          Edit Device
        </h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Device Name is required' }}
            render={({ field }) => (
              <TextField
                type='text'
                sx={{ mb: 2, width: 260 }}
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Box className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit" className={styles['edit_button']} >
              Save
            </Button>
            <Button variant="contained" color="secondary" type="submit" onClick={() => onClose()}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default NameEditControllerComponent;
