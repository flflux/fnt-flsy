import {useEffect } from 'react';
import TopBar from '../app-bar/app-bar';
import DrawerComponent from '../drawer-component/drawer-component';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './layout.module.scss';
import { Box } from '@mui/material';


/* eslint-disable-next-line */
export interface LayoutProps {}

export function Layout(props: LayoutProps) {

  const user=localStorage.getItem('user');
  const navigate=useNavigate();
  

  useEffect(()=>{
    if(user==null){
      navigate("/login");
      console.log("User not logged in");       
    }
    else{
      return
    }
 },[]);

  return (
    <div className={styles['container']}>
      <TopBar />
      <DrawerComponent />
      
      <div className={styles['outlet']} >
        <Box className={styles['Box']}>
        <Outlet/>
        </Box>
      </div>
      
    </div>
  );
}

export default Layout;
