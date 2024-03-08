import styles from './log-out.module.scss';
import { useEffect } from 'react';
import axios from 'axios';
import { environment } from '../../../environments/environment';

/* eslint-disable-next-line */
export interface LogOutProps {}

export function LogOut({onLogout}:{onLogout: () => void}) {

  const apiUrl = environment.apiUrl;

  const logout=async()=>{
    const response=await axios.post(`${apiUrl}/logout`)
  }
  useEffect(()=>{
    logout().then(onLogout);
  },[])
  return <></>
}

export default LogOut;
