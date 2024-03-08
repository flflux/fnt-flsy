import styles from './edit-society.module.scss';
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
import { AddFlat, AddSociety, Building, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';
import { CountriesStates } from '../../../core/consts/countries-states';


export interface EditSocietyProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: AddSociety) => void;
  initialData: AddSociety | null;
}

const EditSocietyComponent: React.FC<EditSocietyProps> = ({ open, onClose, onUpdate, initialData }) => {

  const [country, setCountry] = useState();
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    addressLine1: yup.string().notRequired(),
    addressLine2: yup.string().notRequired(),
    city: yup.string().notRequired(),
    stateCode: yup.string().required('StateCode is required'),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
  });
  const { handleSubmit, control, reset, formState: { errors }, watch, setValue } = useForm<AddSociety>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...initialData,
      isActive: true
    }
  });

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      // setValue('email', initialData.email);
      // setValue('phoneNumber', initialData.phoneNumber);
      setValue('addressLine1', initialData.addressLine1);
      setValue('addressLine2', initialData.addressLine2);
      setValue('city', initialData.city);
      setValue('countryCode', initialData.countryCode);
      setValue('stateCode', initialData.stateCode);
      setValue('postalCode', initialData.postalCode);
      // setValue('floorId', String(initialData.floorId));
    }
  }, [initialData, setValue]);

  const handleUpdate = (data: AddSociety) => {
    // data.flatId = parseInt(data.flatId);
    onUpdate(data);
    reset();
  };

  const countryValue = watch('countryCode');

  const stateOptions = CountriesStates.find((c) => c.code === countryValue)?.states || [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>Edit Society Name</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <Box className={styles['modal_form_containers']}>
            <Box className={styles['modal_first_container']}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society Name"
                    {...field}
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              {/* <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <TextField
                    type="email"
                    className="form-control"
                    placeholder="Enter new Society Email"
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{ required: 'phoneNumber is required' }}
                render={({ field }) => (
                  <TextField
                    type="number"
                    className="form-control"
                    placeholder="Enter new Society phoneNumber"
                    {...field}
                    label="phoneNumber"
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              /> */}
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                rules={{ required: 'addressLine1 is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society addressLine1"
                    {...field}
                    label="addressLine1"
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="addressLine2"
                control={control}
                defaultValue=""
                rules={{ required: 'addressLine2 is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society addressLine2"
                    {...field}
                    label="addressLine2"
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{ required: 'city is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society city"
                    {...field}
                    label="city"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              {/* <Controller
                name="stateCode"
                control={control}
                defaultValue=""
                rules={{ required: 'stateCode is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society stateCode"
                    {...field}
                    label="stateCode"
                    error={!!errors.stateCode}
                    helperText={errors.stateCode?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
              <Controller
                name="countryCode"
                control={control}
                defaultValue=""
                rules={{ required: 'countryCode is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society countryCode"
                    {...field}
                    label="countryCode"
                    error={!!errors.countryCode}
                    helperText={errors.countryCode?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              /> */}
              <Controller
                name="countryCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                    <InputLabel>Country*</InputLabel>
                    <Select
                      {...field}
                      label="Country*"
                      error={!!errors.countryCode}

                    >
                      {CountriesStates.map((countryData, index) => (

                        <MenuItem key={index} value={countryData.code} >
                          {countryData.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="stateCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State" >
                      {stateOptions.map((stateData, index) => (
                        <MenuItem key={index} value={stateData.code}>
                          {stateData.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{ required: 'postalCode is required' }}
                render={({ field }) => (
                  <TextField
                    type="text"
                    className="form-control"
                    placeholder="Enter new Society postalCode"
                    {...field}
                    label="postalCode"
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                    sx={{ marginTop: "5px" }}
                  />
                )}
              />
            </Box>
          </Box>

          <Box className={styles['update_modal-buttons']}>
            <Button className={styles['edit_button']} variant="contained" color="primary" type="submit" >
              Edit
            </Button>
            <Button variant="contained" color="inherit" onClick={() => onClose()}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditSocietyComponent;
