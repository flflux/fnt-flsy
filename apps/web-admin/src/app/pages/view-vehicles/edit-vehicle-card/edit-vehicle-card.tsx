import styles from './edit-vehicle-card.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddFloor, Building, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
/* eslint-disable-next-line */
export interface EditVehicleCardProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: CardDetail) => void;
  initialData: CardDetail | null;
}

interface AddCard {
  number: string;
  type: string;
}
interface CardDetail {
  id:number;
  number: string;
  type: string
}
export function EditVehicleCard({ open, onClose, onUpdate, initialData }: EditVehicleCardProps) {

  const validationSchema = yup.object().shape({
    number: yup.string().required('Card number is required'),
    type: yup.string().required('Card type is Required'),
  });

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddCard>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('number', initialData.number);
      setValue('type', initialData.type);
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: AddCard) => {
    onUpdate(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2 className={styles['h2_tag']}>Edit Card Details</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>

          <Box sx={{ justifyContent: 'space-evenly', display: 'flex', flexDirection: 'row' }}>
            <FormControl sx={{ m: 1, width: 260 }}>
              <InputLabel htmlFor="Card Type">Card Type*</InputLabel>
              <Controller
                name="type"
                control={control}
                // defaultValue=""
                rules={{ required: ' Card Type is required' }}
                render={({ field }) => (
                  <Select
                    label="Card Type*"
                    variant="outlined"
                    {...field}
                  >
                    <MenuItem value="FASTAG" >FasTag</MenuItem>
                    <MenuItem value="RFID">RFID</MenuItem>
                  </Select>
                )} />
            </FormControl>
          </Box>
          <Controller
            name="number"
            control={control}
            defaultValue=""
            rules={{ required: 'Card Number is required' }}
            render={({ field }) => (
              <TextField
                type="text"
                label="Card Number*"
                variant="outlined"
                size="medium"
                {...field}
                error={!!errors.number}
                helperText={errors.number?.message}
                sx={{ margin: '10px' }}
              />
            )}
          />
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
              onClick={() => { onClose() }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditVehicleCard;
