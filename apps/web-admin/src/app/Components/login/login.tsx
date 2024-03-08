import React, { useContext, useEffect, useState } from 'react';
import styles from './login.module.scss';
import { environment } from '../../../environments/environment';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { User } from '@fnt-flsy/data-transfer-types';
import { UserContext } from '../../contexts/user-contexts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import fountlab from "../../../assets/fount-lab-logo.png"
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { Link } from 'react-router-dom';


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


  return (
    <div className={styles['login-page']}>
    <div className={styles['login-img']}></div>
    <div className={styles['form-container']}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className={styles['logo']}><img src={fountlab} alt="font lab logo" width="150px" height="23px"/></div>
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
        <div className={styles['password']}>
          <TextField type="password" 
          {...register('password')}
            label="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            className="form-control"
            placeholder='Enter Your Password'
            sx={{width:"100%"}}
             />
        </div>
        <div  className={styles['forgot-password']}>
          <Link to='/forgot-password' style={{textDecoration:"none"}}>
            Forgot Password?
          </Link>
        </div>
        <div className={styles['submit_btn']}>
          <Button type="submit"
            variant="contained"
            className="btn btn-primary">Log In</Button>
        </div>
      </form>
    </div>
    </div>
  );


}

export default Login;
