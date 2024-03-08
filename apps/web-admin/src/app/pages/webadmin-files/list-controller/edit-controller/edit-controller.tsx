import styles from './edit-controller.module.scss';
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


export interface EditControllerProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: EditDevice) => void;
  initialData: EditDevice | null;
}


const EditControllerComponent: React.FC<EditControllerProps> = ({ open, onClose, onUpdate, initialData }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<EditDevice>({
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

  const handleUpdate = (data: EditDevice) => {
    onUpdate(data);
    onClose();
  };
  const closeModal = () => {
    onClose();
  }



  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>
          Edit Controller
        </h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                sx={{ mb: 2, width: 350 }}
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          {/* 
      <Box m={2}>
        <Controller
          name="controllerId"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Controller ID"
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Box>

      <Box m={2}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Type</InputLabel>
          <Controller
            name="type"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field} label="Type">
                <MenuItem value="">
                  <em>Select Type</em>
                </MenuItem>
                <MenuItem value="Option 1">Option 1</MenuItem>
                <MenuItem value="Option 2">Option 2</MenuItem>
                <MenuItem value="Option 3">Option 3</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box> */}

          <Box className={styles['update_modal-buttons']}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit" className={styles['edit_button']} >
              Edit
            </Button>
            <Button variant="contained" color="primary" type="submit" onClick={() => onClose()}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditControllerComponent;
