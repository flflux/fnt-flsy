import styles from './key-edit-controller.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import axios from 'axios';


export interface KeyEditControllerProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: Form) => void;
  initialData: Form | null;
}

interface Form{
  deviceKey:string;
}


const KeyEditControllerComponent: React.FC<KeyEditControllerProps> = ({ open, onClose, onUpdate, initialData }) => {

  const validationSchema = yup.object().shape({
    deviceKey: yup.string().required('Device Key is required'),
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
      setValue('deviceKey', initialData.deviceKey);
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
            name="deviceKey"
            control={control}
            defaultValue=""
            rules={{ required: 'Device Key is required' }}
            render={({ field }) => (
              <TextField
                type='text'
                sx={{ mb: 2, width: 260 }}
                {...field}
                label="Device Key"
                // focused
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="******"
                variant="outlined"
                fullWidth
                error={!!errors.deviceKey}
                helperText={errors.deviceKey?.message}
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

export default KeyEditControllerComponent;
