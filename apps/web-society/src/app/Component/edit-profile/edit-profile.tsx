import { useContext, useEffect, useState } from 'react';
import styles from './edit-profile.module.scss';
import { SocietyContext, UserContext } from "../../contexts/user-context";
import { Box, Button, Card, CardContent, Checkbox, CircularProgress, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { enqueueSnackbar } from 'notistack';


export interface EditProfileProps {

  editUser: boolean;
  userEdit: (value: boolean) => void;
}

interface Manager {
  id: number;
  isPrimary: boolean;
  societyRole: {
    name: string;
  },
  user: {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
  }
}

export interface ViewUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export function EditProfile({ editUser, userEdit }: EditProfileProps) {
  const user = useContext(UserContext);
  const societycontext = useContext(SocietyContext);
  const apiUrl = environment.apiUrl;
  const [data, setData] = useState<ViewUser | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const validationSchema = yup.object().shape({
    user: yup.object().shape({
      firstName: yup.string().required('First name is required'),
      lastName: yup.string().required('Last name is required'),
      email: yup.string().required('Email is required'),
      phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
    }),
    isPrimary: yup.boolean().notRequired(),
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<Manager>({
    resolver: yupResolver(validationSchema),

  });



  const getUserInfo = async () => {

    try {
      setLoadingUserInfo(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/users/${user?.id}`, {
        withCredentials: true,
      });
      setData(response.data);
      console.log("Device Detail:", response.data);
      console.log("Device Detail:", response.data.isPrimary);
      setLoadingUserInfo(false);
    } catch (error) {
      console.log("Error in fetching device details", error);
      setLoadingUserInfo(false);
    }

  }

  useEffect(() => {
    getUserInfo();
  }, [user]);

  useEffect(() => {
    if (editUser) {
      reset();
      setValue('user.firstName', data?.firstName as string);
      setValue('user.lastName', data?.lastName as string);
      setValue('user.email', data?.email as string);
      setValue('user.phoneNumber', data?.phoneNumber as string);
      // setValue('isPrimary',initialData.isPrimary);
    }
  }, [editUser, setValue, societycontext?.id]);

  //Update a Manager

  const handleUpdate = async (formData: Manager) => {
    try {
      const res = await axios.put(`${apiUrl}/societies/${societycontext?.id}/managers/${user?.id}`,
        { firstName: formData.user.firstName, lastName: formData.user.lastName, email: formData.user.email, phoneNumber: formData.user.phoneNumber },
        { withCredentials: true }
      );

      if (res.data) {
        console.log('Details Updated Successfully');
        enqueueSnackbar("Details updated successfully!", { variant: 'success' });
        console.log(res.data);
        // setIsModalOpen(false);  
        userEdit(false);
        getUserInfo();
      } else {
        console.log('Update data not received');
        enqueueSnackbar("Error in details updation!", { variant: 'error' });
      }
    }
    catch (error) {
      console.log('Something went wrong in Update', error);
      enqueueSnackbar("Something went wrong in update", { variant: 'error' });
    }
  };

  return (
    <div className={styles['container']}>
      {loadingUserInfo ? (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "30vh" }}><CircularProgress /></div>
      // eslint-disable-next-line react/jsx-no-useless-fragment
      ) : (<>
        {editUser ? (
          <Box className={styles['modal-container']}>
            {/* <h2 className={styles['h2_tag']}>Edit Manager</h2> */}
            <form onSubmit={handleSubmit(handleUpdate)}>
              <Box className={styles['modal_first_container']}>
                <Controller
                  name="user.firstName"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Admin First Name is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      label="First Name"
                      variant="outlined"
                      size="medium"
                      {...field}
                      error={!!errors.user?.firstName}
                      helperText={errors.user?.firstName?.message}
                      sx={{ margin: '10px' }}
                    />
                  )}
                />
                <Controller
                  name="user.lastName"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Admin Last Name is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      label="Last Name"
                      variant="outlined"
                      size="medium"
                      {...field}
                      error={!!errors.user?.lastName}
                      helperText={errors.user?.lastName?.message}
                      sx={{ margin: '10px' }}
                    />
                  )}
                />
                <Controller
                  name="user.email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Admin Email is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      label="Email"
                      variant="outlined"
                      size="medium"
                      {...field}
                      error={!!errors.user?.email}
                      helperText={errors.user?.email?.message}
                      sx={{ margin: '10px' }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="user.phoneNumber"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Admin Phone Number is required' }}
                  render={({ field }) => (
                    <TextField
                      type="text"
                      label="Phone Number"
                      variant="outlined"
                      size="medium"
                      {...field}
                      error={!!errors.user?.phoneNumber}
                      helperText={errors.user?.phoneNumber?.message}
                      sx={{ margin: '10px' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment sx={{ mt: "1px" }} position="start">
                            +91
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />


              </Box>

              <Box className={styles['btn_container']} sx={{ marginTop: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mr: "10px" }}
                  className={styles['buttons_container']}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={styles['buttons_container']}
                  onClick={() => userEdit(false)}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>) : (

          <Box className={styles['modal-container']}>
            <Box className={styles['modal_second_container']}>
              <Box className={styles['user-card']} sx={{ minWidth: 275, }}>
                <CardContent>
                  <Grid className={styles['user-grid']} container spacing={3.6} columnGap={0.01} padding={1} >
                    <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >First Name:</Typography></Grid>
                    <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.firstName}</Typography></Grid>
                    <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >Last Name:</Typography></Grid>
                    <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.lastName}</Typography></Grid>

                    <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >Email Id:</Typography></Grid>
                    <Grid item xs={6} justifyContent="flex-start"><Typography className={styles['card-typo']} >{data?.email}</Typography></Grid>

                    <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >Phone No:</Typography></Grid>
                    <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >+91-{data?.phoneNumber}</Typography></Grid>

                  </Grid>
                </CardContent>
              </Box>



            </Box>

          </Box>

        )}
      </>)}

    </div>
  );
}

export default EditProfile;
