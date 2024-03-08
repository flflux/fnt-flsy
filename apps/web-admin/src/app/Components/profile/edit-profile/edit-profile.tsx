import { useContext, useEffect, useState } from 'react';
import styles from './edit-profile.module.scss';
import { SocietyContext, UserContext } from "../../../contexts/user-contexts";
import { Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { enqueueSnackbar } from 'notistack';
import { ViewUser } from '@fnt-flsy/data-transfer-types';


export interface EditProfileProps {

  editUser:boolean;
  userEdit: (value: boolean) => void;
 }

 interface AddFLuser {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

// export interface ViewUser {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   isPrimary: boolean;
// }

export function EditProfile({editUser, userEdit }: EditProfileProps) {
  const user = useContext(UserContext);
  const societycontext = useContext(SocietyContext);
  const apiUrl = environment.apiUrl;
  const [data, setData] = useState<ViewUser | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const validationSchema = yup.object().shape({
    superRole: yup.string().notRequired(),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup.string().matches(/[6789][0-9]{9}/, 'Invalid phone number').min(10).max(10).required('Phone number is required'),
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<AddFLuser>({
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
    if(editUser){
      reset();
    setValue('firstName', data?.firstName as string);
    setValue('lastName', data?.lastName as string);
    setValue('email', data?.email as string);
    setValue('phoneNumber', data?.phoneNumber as string);
    // setValue('isPrimary',initialData.isPrimary);
    }   
  }, [editUser,setValue, societycontext?.id]);

  //Update a Manager

  const handleUpdate = async (formData: AddFLuser) => {
    try {
      const res = await axios.put(`${apiUrl}/admins/${user?.id}`,
         formData,
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

  function insertSpacesBetweenWords(text: string | undefined) {
    if (!text) {
      return ''; 
    }
    const words = text.split('_');
    const formattedWords = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return formattedWords.join(' ');
  }

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
              name="firstName"
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
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  sx={{ margin: '10px' }}
                />
              )}
            />
            <Controller
              name="lastName"
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
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  sx={{ margin: '10px' }}
                />
              )}
            />
            <Controller
              name="email"
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
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ margin: '10px' }}
                  disabled
                />
              )}
            />
            <Controller
              name="phoneNumber"
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
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  sx={{ margin: '10px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment sx={{mt:"1px"}} position="start">
                        +91
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            {/* <FormControl sx={{ width: 'auto', m: "10px" }} error={!!errors.superRole}>
              <InputLabel htmlFor="type"  >Role*</InputLabel>
              <Controller
                name="superRole"
                control={control}
                defaultValue={"ADMIN"}
                rules={{ required: 'SuperRole Name is Required' }}
                render={({ field }) => (
                  <Select
                    label="Role*"
                    variant="outlined"
                    {...field}
                    error={!!errors.superRole}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 97
                        },
                      },
                    }}
                  >
                    <MenuItem sx={{ justifyContent: "start" }} value="ADMIN">ADMIN</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.superRole?.message}</FormHelperText>
            </FormControl> */}
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
            <Box className={styles['user-card']} sx={{ minWidth: 275 }}>
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
                  <Grid item xs={4} justifyContent="flex-start"><Typography className={styles['card-typo']} >Role:</Typography></Grid>
                  <Grid item xs={5} justifyContent="flex-start"><Typography className={styles['card-typo']} >{insertSpacesBetweenWords(data?.superRole)}</Typography></Grid>

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
