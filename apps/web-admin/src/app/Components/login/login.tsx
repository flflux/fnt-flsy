import React, { useContext, useEffect, useState } from 'react';
import styles from './login.module.scss';
import { environment } from '../../../environments/environment';
import Button from '@mui/material/Button';
import { InputLabel, TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { User } from '@fnt-flsy/data-transfer-types';
import { UserContext } from '../../contexts/user-contexts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import fountlab from "../../../assets/fount-lab-logo.png"
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import hivelogo from "../../../assets/HIVE_Logo_Black.svg"
import tagline from "../../../assets/HIVE_Tagline_Black.svg"

/* eslint-disable-next-line */
export interface LoginProps {
  onLogin: (user: User) => void
}


export function Login({ onLogin }: LoginProps) {


  const usercontext = useContext(UserContext);

  const apiUrl = environment.apiUrl;

  const validationSchema = yup.object().shape({
    email: yup.string().email('Must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),

  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(validationSchema) });


  const handleOnSubmit = async (formData: { email: any; password: any; }) => {
    try {
      const { email, password } = formData;
      const res = await axios.post<User>(`${apiUrl}/login`, { email, password }, {
        withCredentials: true
      }
      );
      const user = res.data;
      onLogin(user);
      // enqueueSnackbar("Login successfully!", { variant: 'success' });
      console.log('res', res);
    } catch (error) {
      
      console.log(error)
      enqueueSnackbar("Invalid username or password ", { variant: 'error' });
      console.log("Something went wrong")
    
  }
  }

  const handleLoginButtonClick = () => {
    handleSubmit(handleOnSubmit)();
  };


  return (
    <div className={styles.loginContainer}>
    <img src={tagline} alt="Hive Tagline" className={styles.logo1} />
    <div className={styles.logoContainer}>
      <img src={hivelogo} alt="Hive Logo" className={styles.logo} />
    </div>
    <div className={styles.formContainer}>
    <h1 className={styles.heading}>Sign in</h1>
    <form onSubmit={handleSubmit(handleOnSubmit)} className={styles.form}>
          <div className={styles.inputContainer}>
          <div className={styles.inputField}>
          <InputLabel htmlFor="email" style={{
    marginLeft: '5px', // Adjust margin as needed
   
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
            <div className={styles.inputField}>
         <InputLabel htmlFor="password" style={{
    marginLeft: '15px', // Adjust margin as needed
    color: 'white' // Set color
  }}>Password</InputLabel>
            <input
            type="password"
            {...register("password",{ required: "Password is required" })}
            className={styles.input} // Apply your CSS class for input styles
          />
           {/* <div className={styles.errorContainer}>
            {errors.password && (
              <p className={styles.error}>
                <span style={{ fontSize: 'small', color: 'red' }}>{errors.password.message}</span>
              </p>
            )}
          </div> */}
            </div>
          </div>
        </form>
        <div className={styles.buttonContainer}>
          <Button onClick={handleLoginButtonClick} sx={{ width: '225px', height:'40px', backgroundColor: 'rgb(245, 158, 11)', color: 'white',
             "&:hover": { backgroundColor: 'rgb(245, 158, 11)' },
             "&:active": { backgroundColor: 'rgb(245, 158, 11)' }
           }}>Login</Button>
          <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
          
        </div>
      </div>
    </div>
  );


}

export default Login;
