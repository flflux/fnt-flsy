import styles from './add-controller.module.scss';
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { AddDevice, Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';


/* eslint-disable-next-line */
export interface AddControllerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddDevice) => void;
}

const AddControllerComponent: React.FC<AddControllerProps> = ({ open, onClose, onSubmit }) => {

  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    deviceKey: yup.string().required('flatNumber is Required'),
    type: yup.string().required('flatNumber is Required'),
    deviceId: yup.string().required('flatNumber is Required'),
    // isActive:yup.boolean().required()
  });
  const { handleSubmit, control, reset, formState: { errors } } = useForm<AddDevice>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      "societyId": 1,
      "siteId": 0
    }
  });

  const handleFormSubmit = (data: AddDevice) => {
    onSubmit(data);
    reset();
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>
          Add Controller
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                type="text"
                label="Name"
                variant="outlined"
                size="medium"
                {...field}
                sx={{ m: 1, width: 300 }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="deviceId"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                type="text"
                {...field}
                label="device ID"
                variant="outlined"
                sx={{ m: 1, width: 300 }}
                error={!!errors.deviceId}
                helperText={errors.deviceId?.message}
              />
            )}
          />
          <Controller
            name="deviceKey"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                type="text"
                {...field}
                label="device Key"
                variant="outlined"
                sx={{ m: 1, width: 300 }}
                error={!!errors.deviceKey}
                helperText={errors.deviceKey?.message}
              />
            )}
          />
          <FormControl variant="outlined" sx={{ m: 1, width: 300 }}>
            <InputLabel>Type</InputLabel>
            <Controller
              name="type"
              control={control}
              // defaultValue=""

              render={({ field }) => (
                <Select {...field} label="Type" error={!!errors.type}>
                  {/* <MenuItem value="">
                      <em>Select Type</em>
                    </MenuItem> */}
                  <MenuItem value="MONITORING">Monitoring</MenuItem>
                  <MenuItem value="CONTROL">Control</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <Box m={2}>
            <Button sx={{ mr: "10px" }} variant="contained" color="primary" type="submit" className={styles['update_modal-buttons']} >
              + Add
            </Button>
            <Button variant="contained" color="primary" onClick={onClose} className={styles['update_modal-buttons']}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default AddControllerComponent;
