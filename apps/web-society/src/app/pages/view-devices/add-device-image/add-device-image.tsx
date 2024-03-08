import styles from './add-vehicle-card.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormHelperText, IconButton, InputAdornment } from '@mui/material';
/* eslint-disable-next-line */
export interface AddDeviceImageProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Form) => void;
}

interface Form {
  file: string;
}

export function AddDeviceImage({ open, onClose, onSubmit }: AddDeviceImageProps) {
  const validationSchema = yup.object().shape({
    file: yup.string().required('Card type is Required'),
  });
  const { setValue, register, handleSubmit, control, reset, formState: { errors } } = useForm<Form>({
    resolver: yupResolver(validationSchema),
  });

  const handleFormSubmit = (data: Form) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onClose()
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Add Card</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>

          <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
            <FormControl sx={{ m: 1, width: 260 }} error={!!errors.file}>
              <InputLabel htmlFor="Card Type">Select Card Type*</InputLabel>
              <Controller
                name="file"
                control={control}
                // defaultValue=""
                rules={{ required: ' Card Type is required' }}
                render={({ field }) => (
                  <><Select
                    label="Select Card Type*"
                    variant="outlined"
                    {...field}
                    error={!!errors.file}
                  >
                    <MenuItem value="FASTAG">FasTag</MenuItem>
                    <MenuItem value="RFID">RFID</MenuItem>
                  </Select><FormHelperText sx={{ color: "#d32f2f" }}>{errors.file?.message}</FormHelperText></>
                )} />
            </FormControl>
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: "10px" }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default AddDeviceImage;
