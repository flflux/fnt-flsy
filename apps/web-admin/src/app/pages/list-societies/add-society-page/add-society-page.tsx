import styles from './add-society-page.module.scss';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
  Typography,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { environment } from '../../../../environments/environment';
import Breadcrumbs from '../../../Components/bread-crumbs/bread-crumbs';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CountriesStates } from '../../../core/consts/countries-states';
import {
  AddFlat,
  Building,
  ViewFlat,
  ViewFloor,
} from '@fnt-flsy/data-transfer-types';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';


export interface AddSociety {
  name: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateCode?: string;
  countryCode: string;
  postalCode: string;
  isActive: boolean;
  code: string;
}

/* eslint-disable-next-line */
export interface AddSocietyPageProps { }

export function AddSocietyPage(props: AddSocietyPageProps) {
  const [country, setCountry] = useState<string>('');

  const apiUrl = environment.apiUrl;
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    addressLine1: yup.string().required(),
    addressLine2: yup.string().notRequired(),
    city: yup.string().required(),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone Number is required'),
    stateCode: yup.string().notRequired(),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
    code: yup.string().required('code is required'),

  });
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddSociety>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      stateCode: '',
      isActive: true,
    },
  });

  const countryValue = watch('countryCode');

  
  const onSubmit = async (data: AddSociety) => {
    try {
      const response = await axios.post(`${apiUrl}/societies`, data,
        {
          withCredentials: true,

        });
      console.log('Society added:', response.data);
      reset();
      enqueueSnackbar("Society added successfully!", { variant: 'success' });
      navigate(`/societies`);
    } catch (error) {
      console.error('Error adding society:', error);
      enqueueSnackbar("An error occurred while adding the society", { variant: 'error' });
    }
  };

  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];
  const breadcrumbs = [
    {
      to: '/',
      label: 'Home',
    },
    { to: '/societies', label: 'Societies' },
    {
      label: 'Add',
    },
  ];

  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className={styles['container']}>
        <Typography variant="h1" sx={{ my: '20px' }}>
          <Icon component={AddIcon} /> Add Society
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Controller
                name="code"
                control={control}
                defaultValue=""
                rules={{ required: 'code is required' }}
                render={({ field }) => (
                  <TextField
                    label="Society Code*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    label="Name*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField

                    label="Email*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    label="Phone Number*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          +91
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                rules={{ required: 'Address_line1 is required' }}
                render={({ field }) => (
                  <TextField
                    label="Address 1*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.addressLine1}
                    helperText={errors.addressLine1?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="addressLine2"
                control={control}
                defaultValue=""
                rules={{ required: 'address_line2 is required' }}
                render={({ field }) => (
                  <TextField
                    label="Address 2"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.addressLine2}
                    helperText={errors.addressLine2?.message}
                  />
                )}
              />
            </div>
           
          </div>

          <div className={styles['form-row']}>
          <div className={styles['form-item']}>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <TextField
                    label="City*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="countryCode"
                control={control}
                defaultValue={CountriesStates.find(countryData => countryData.name === "India")?.code || ""}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Country*</InputLabel>
                    <Select
                      {...field}
                      label="Country*"
                      value={field.value || ""}
                      error={!!errors.countryCode}
                      disabled
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
              <FormHelperText sx={{ ml: "12px", color: "#d32f2f" }}>{errors.countryCode?.message}</FormHelperText>
            </div>
           
          </div>
          <div className={styles['form-row']}>
          <div className={styles['form-item']}>
              <Controller
                name="stateCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State*">
                      {stateOptions.map((stateData, index) => (
                        <MenuItem key={index} value={stateData.code}>
                          {stateData.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            <div className={styles['form-item']}>
              <Controller
                name="postalCode"
                control={control}
                defaultValue=""
                rules={{ required: 'postalcode is required' }}
                render={({ field }) => (
                  <TextField
                    label="Postal Code*"
                    variant="outlined"
                    {...field}
                    fullWidth
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                  />
                )}
              />
            </div>

          </div>
          <div className={styles['form-row']}>
            <div className={styles['form-item']}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
            </div>
          </div>
        </form>

      </div>
    </>
  );
}

export default AddSocietyPage;
