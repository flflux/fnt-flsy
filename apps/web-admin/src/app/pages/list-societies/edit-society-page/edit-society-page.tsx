import styles from './edit-society-page.module.scss';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
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
import { environment } from '../../../../environments/environment';
import Breadcrumbs from '../../../Components/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CountriesStates } from '../../../core/consts/countries-states';
import {
  AddFlat,
  Building,
  ViewFlat,
  ViewFloor,
} from '@fnt-flsy/data-transfer-types';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Society } from '@prisma/client';
import { enqueueSnackbar } from 'notistack';
import { SocietyContext } from '../../../contexts/user-contexts';


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

export interface ViewSociety {
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
export interface EditSocietyPageProps { }

export function EditSocietyPage(props: EditSocietyPageProps) {
  const apiUrl = environment.apiUrl;
  const [society, setSociety] = useState<ViewSociety | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).required('Phone Number is required'),
    addressLine1: yup.string().required('Address line 1 is required'),
    addressLine2: yup.string().notRequired(),
    city: yup.string().required('City is required'),
    stateCode: yup.string().notRequired(),
    countryCode: yup.string().required('CountryCode is required'),
    postalCode: yup.string().required('PostalCode is required'),
    code: yup.string().required('code is required'),
  });
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ViewSociety>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const countryValue = watch('countryCode');
  const stateOptions =
    CountriesStates.find((c) => c.code === countryValue)?.states || [];

  const params = useParams();
  const societyContext = useContext(SocietyContext);
  console.log(societyContext, params);

  useEffect(() => {
    async function fetchSocietytData() {
      try {
        const response = await axios.get<ViewSociety>(`${apiUrl}/societies/${params.societyId}`,
          {
            withCredentials: true,

          }
        );
        const societyData = response.data;
        console.log('societyData', response);
        setSociety(societyData);

        // Set the form data using setValue
        setValue('name', societyData.name);
        setValue('email', societyData.email);
        setValue('phoneNumber', societyData.phoneNumber);
        setValue('addressLine1', societyData.addressLine1);
        setValue('addressLine2', societyData.addressLine2);
        setValue('city', societyData.city);
        setValue('countryCode', societyData.countryCode);
        setValue('stateCode', societyData.stateCode);
        setValue('postalCode', societyData.postalCode);
        setValue('code', societyData.code);
      } catch (error) {
        console.error('Error fetching Society data:', error);
      }
    }

    fetchSocietytData();
  }, [apiUrl, id, setValue]);

  const onSubmit = async (data: AddSociety) => {
    try {
      const response = await axios.put(`${apiUrl}/societies/${params.societyId}`, data,
        {
          withCredentials: true,

        });
      console.log('Society updated:', response.data);

      enqueueSnackbar("Society updated successfully!", { variant: 'success' });
      navigate(`/societies`);
    } catch (error) {
      console.error('Error updating Society:', error);
      enqueueSnackbar("Something went wrongAn error occurred while updating the society.", { variant: 'error' });

    }
  };

  const breadcrumbs = [
    {
      to: '/',
      label: 'Home',
    },
    { to: '/societies', label: 'Societies' },

    {
      label: 'Edit',
    },
  ];
  return (
    <>
      <Breadcrumbs paths={breadcrumbs} />
      <div className={styles['container']}>
        <Typography variant="h1" sx={{ my: '20px' }}>
          <Icon component={EditIcon} /> Edit Society
        </Typography  >
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
                    disabled
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
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined" >
                    <InputLabel>Country*</InputLabel>
                    <Select

                      {...field}
                      label="Country*"
                      error={!!errors.countryCode}
                      disabled
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
                  <FormControl fullWidth variant="outlined" >
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State*" >
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

export default EditSocietyPage;
