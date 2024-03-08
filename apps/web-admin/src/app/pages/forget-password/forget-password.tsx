import styles from './forget-password.module.scss';
import { environment } from '../../../environments/environment';
import { UserContext } from '../../contexts/user-contexts';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@fnt-flsy/data-transfer-types';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import fountlab from "../../../assets/fount-lab-logo.png";
import { enqueueSnackbar } from 'notistack';
import { Button, CircularProgress, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface ForgetPasswordProps {}

export function ForgetPassword(props: ForgetPasswordProps) {
  const usercontext = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const apiUrl = environment.apiUrl;  
  const params=useParams();
  console.log("Params:",params);

  const navigate=useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email').required('Email is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });


  const handleOnSubmit = async (formData: { email: any}) => {
    console.log(formData, params.emailId,params.token);
    
        try {
          setLoading(true);
          const { email} = formData;
          const res = await axios.post(`${apiUrl}/forgot-password`, { email},
          {
            // headers: {
            //   Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            // },
            withCredentials: true
          }
          );
          const user = res.data;
          // onLogin(user);
          window.alert('Password Update link sent to Email successfully!');
          enqueueSnackbar("Password Update link sent to Email successfully!", { variant: 'success' });
          navigate('/login');
          console.log('res', res);
          setLoading(false);
        } catch (error) { 
          console.log(error)
          enqueueSnackbar("Something went wrong", { variant: 'error' });
          console.log("Something went wrong");
          setLoading(false);
      }
  }
  return (
    <div className={styles['login-page']}>
      <div className={styles['login-img']}></div>
      <div className={styles['form-container']}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className={styles['logo']}><img src={fountlab} alt="font lab logo" width="150px" height="23px"/></div>
      <h1 style={{display:'flex'  }}>Forgot Password</h1>
        <div className={styles['email']}>
          <TextField type="email" 
          {...register('email')}
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            className="form-control"
            placeholder='Enter Your Email Id'
            sx={{width:"100%"}}
             />
        </div> 
        <div >
          <Button type="submit"
            variant="contained"
            classes="btn btn-primary" className={styles['submit_btn']}>
             {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default ForgetPassword;
