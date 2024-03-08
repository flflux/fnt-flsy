import { Box, Button, CircularProgress, TextField } from '@mui/material';
import styles from './security.module.scss';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user-context';
import { enqueueSnackbar } from 'notistack';
import { ViewUser } from '@fnt-flsy/data-transfer-types';

/* eslint-disable-next-line */
export interface SecurityProps { }

interface Password {
  old_password: string;
  new_password: string;
  confirmPassword: string;
}

export function Security(props: SecurityProps) {
  const apiUrl = environment.apiUrl;
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ViewUser | null>(null);

  const validationSchema = yup.object().shape({
    old_password: yup.string().required('Current password is required'),
    new_password: yup.string().required('New password is required'),
    confirmPassword: yup.string()
    .oneOf([yup.ref('new_password')], 'New password does not match')
    .required('Confirm password is required'),
      
  });
  const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<Password>({
    resolver: yupResolver(validationSchema),

  });


  const getUserInfo = async () => {

    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/users/${user?.id}`, {
        withCredentials: true,
      });
      setData(response.data);
      console.log("Device Detail:", response.data);
      console.log("Device Detail:", response.data.isPrimary);
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching device details", error);
      setLoading(false);
    }

  }

  useEffect(() => {
    getUserInfo();
  }, [user]);

  //Update a Password

  const handleUpdate = async (formData: Password) => {
    try {
      const res = await axios.put(`${apiUrl}/users/change-password`,
      { old_password: formData.old_password, new_password: formData.new_password},
        { withCredentials: true }
      );

      if (res.data) {
        console.log('Manager Updated Successfully');
        enqueueSnackbar("Password updated successfully!", { variant: 'success' });
        console.log(res.data);
        reset();
      } else {
        console.log('Update data not received');
        enqueueSnackbar("Error in password updation!", { variant: 'error' });
      }
    }
    catch (error) {
      console.log('Something went wrong in Update', error);
      enqueueSnackbar("Something went wrong in update", { variant: 'error' });
    }
  };
  return (
    <div className={styles['container']}>
      {loading ? (<div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "30vh" }}><CircularProgress /></div>
      ) : (
        <Box className={styles['modal-container']}>
          <form onSubmit={handleSubmit(handleUpdate)}>
            <Box className={styles['modal_first_container']}>

              <Controller
                name="old_password"
                control={control}
                defaultValue=""
                rules={{ required: 'Current password is required' }}
                render={({ field }) => (
                  <TextField
                    type="password"
                    label="Current password"
                    variant="outlined"
                    size="medium"
                    {...field}
                    error={!!errors?.old_password}
                    helperText={errors?.old_password?.message}
                    sx={{ margin: '10px' }}
                  />
                )}
              />
              <Controller
                name="new_password"
                control={control}
                defaultValue=""
                rules={{ required: 'New password is required' }}
                render={({ field }) => (
                  <TextField
                    type="password"
                    label="New password"
                    variant="outlined"
                    size="medium"
                    {...field}
                    error={!!errors?.new_password}
                    helperText={errors?.new_password?.message}
                    sx={{ margin: '10px' }}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                rules={{ required: 'Confirm password is required' }}
                render={({ field }) => (
                  <TextField
                    type="password"
                    label="Confirm password"
                    variant="outlined"
                    size="medium"
                    {...field}
                    error={!!errors?.confirmPassword}
                    helperText={errors?.confirmPassword?.message}
                    sx={{ margin: '10px' }}
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
              onClick={() => reset()}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      )}

    </div>
  );
}

export default Security;
