import styles from './add-society.module.scss';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { environment } from '../../../../environments/environment';
import axios from 'axios';
import { AddFlat, AddSociety, Building, ViewFlat, ViewFloor } from '@fnt-flsy/data-transfer-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { CountriesStates } from '../../../core/consts/countries-states';




export interface AddSocietyProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddSociety) => void;
}


const AddSocietyComponent: React.FC<AddSocietyProps> = ({ open, onClose, onSubmit }) => {
  const [country, setCountry] = useState<string>('');
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    // email: yup.string().email('Invalid email').required('Email is required'),
    // phoneNumber: yup.string().min(10).required('Phone number is required'),
    addressLine1: yup.string().notRequired(),
    addressLine2: yup.string().notRequired(),
    city: yup.string().notRequired(),
    stateCode: yup.string().required('StateCode is required'),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
    // isActive: yup.boolean().required('')
    // isActive:yup.boolean().required()
  });

  const { handleSubmit, control, reset, watch, formState: { errors } } = useForm<AddSociety>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true
    }
  });

  const handleFormSubmit = (data: AddSociety) => {
    onSubmit(data);
    reset();
  };

  // const countryValue = watch('countryCode');
  // setCountry(countryValue)
  // const stateOptions =
  //   CountriesStates.find((c) => c.code === countryValue)?.states || [];

  useEffect(() => {
    const countryValue = watch('countryCode');
    setCountry(countryValue);
  }, [watch('countryCode')]);
  
  const stateOptions =
  [
    { name: 'Andaman and Nicobar Islands', code: 'AN' },
    { name: 'Andhra Pradesh', code: 'AP' },
    { name: 'Arunachal Pradesh', code: 'AR' },
    { name: 'Assam', code: 'AS' },
    { name: 'Bihar', code: 'BR' },
    { name: 'Chandigarh', code: 'CH' },
    { name: 'Chhattisgarh', code: 'CT' },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', code: 'DH' },
    { name: 'Delhi', code: 'DL' },
    { name: 'Goa', code: 'GA' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Himachal Pradesh', code: 'HP' },
    { name: 'Jammu and Kashmir', code: 'JK' },
    { name: 'Jharkhand', code: 'JH' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Kerala', code: 'KL' },
    { name: 'Ladakh', code: 'LA' },
    { name: 'Lakshadweep', code: 'LD' },
    { name: 'Madhya Pradesh', code: 'MP' },
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Manipur', code: 'MN' },
    { name: 'Meghalaya', code: 'ML' },
    { name: 'Mizoram', code: 'MZ' },
    { name: 'Nagaland', code: 'NL' },
    { name: 'Odisha', code: 'OR' },
    { name: 'Puducherry', code: 'PY' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'Sikkim', code: 'SK' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Telangana', code: 'TG' },
    { name: 'Tripura', code: 'TR' },
    { name: 'Uttar Pradesh', code: 'UP' },
    { name: 'Uttarakhand', code: 'UT' },
    { name: 'West Bengal', code: 'WB' },
  ];
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles['modal-container']}>
        <h2>Add New Society</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "row" }} className={styles['modal_form_containers']}>
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
              <Box className={styles['modal_second_container']}>
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
                          <MenuItem key={index} value={countryData.code}>
                            {countryData.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {country ? (
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
                ) : (
                    <Controller
                      name="stateCode"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormControl sx={{ m: 1, width: 260 }} variant="outlined" >
                          <InputLabel>State</InputLabel>
                          <Select {...field} label="State" >
                            <MenuItem value="Please">
                            Select a Country
                            </MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    />
                )}
                {/* <Controller
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
                /> */}
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
          </Box>
          <Box className={styles['update_modal-buttons']}>
            <Button variant="contained" color="primary" type="submit">
              Add
            </Button>
            <Button variant="contained" color='inherit' onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </form>

      </Box>
    </Modal>
  );
}

export default AddSocietyComponent;
