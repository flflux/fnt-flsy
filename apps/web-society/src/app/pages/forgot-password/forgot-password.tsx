import styles from './forgot-password.module.scss';
import { environment } from '../../../environments/environment';
import { UserContext } from '../../contexts/user-context';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@fnt-flsy/data-transfer-types';
import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import fountlab from "../../../assets/fount-lab-logo.png";
import { enqueueSnackbar } from 'notistack';
import { Button, TextField, CircularProgress, InputLabel } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Link, useNavigate, useParams } from 'react-router-dom';
import hivelogo from "../../../assets/HIVE_Logo_Black.svg"
import tagline from "../../../assets/HIVE_Tagline_Black.svg"

/* eslint-disable-next-line */
export interface ForgotPasswordProps {}

export function ForgotPassword(props: ForgotPasswordProps) {
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
          // setEmailSent(true);
          
          window.alert('Password Update link sent to Email successfully!');
          enqueueSnackbar("Password Update link sent to Email successfully!", { variant: 'success' });
          console.log('res', res);
          // navigate('/login');
          setLoading(false);
        } catch (error) { 
          console.log(error)
          enqueueSnackbar("Something went wrong", { variant: 'error' });
          console.log("Something went wrong");
          setLoading(false);
      }
      // console.log("email sent",emailSent);
  }
  return (
    <><div className={styles.loginContainer}>
    <img src={tagline} alt="Hive Tagline" className={styles.logo1} />
    <div className={styles.logoContainer}>
      <img src={hivelogo} alt="Hive Logo" className={styles.logo} />
    </div>
      <div className={styles['formContainer']}>

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          {/* <div className={styles['logo']}><img src={fountlab} alt="font lab logo" width="150px" height="23px" /></div> */}
          <h2 style={{ display: 'flex', color:'rgb(247, 253, 253)',fontFamily:'sans-serif',marginLeft:'10px' }}>Forgot Password</h2>

          <div className={styles.inputField}>
          <InputLabel htmlFor="email" style={{
    marginLeft: '15px', // Adjust margin as needed
   
    color: 'white' // Set color
  }}>Email</InputLabel>
             <input
            type="email"
            {...register("email",{ required: "Email is required" } )}
            className={styles.input} // Apply your CSS class for input styles
          />
             {/* <div className={styles.errorContainer}>
            {errors.email && (
              <p className={styles.error}> 
                <span style={{ fontSize: 'medium', color: 'red' }}>{errors.email.message}</span>
              </p>
            )}
          </div> */}
            </div>
            <div className={styles.inputField}></div>
          {/* <div className={styles['email']}>
            <TextField type="email"
              {...register('email')}
              label="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              className="form-control"
              placeholder='Enter Your Email Id'
              sx={{ width: "100%" }} />
          </div> */}
          <div>
            <Button type="submit"
              variant="contained"
              sx={{ width: '200px', height:'40px', backgroundColor: 'rgb(245, 158, 11)', color: 'white',marginLeft:'30px' }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
              </Button>
          </div>
        </form>
      </div>
    </div>
    {/* {emailSent ? <Alert severity="success">Password Update link sent to Email successfully!</Alert>:<div/>} */}
    </>
  );
}

export default ForgotPassword;

