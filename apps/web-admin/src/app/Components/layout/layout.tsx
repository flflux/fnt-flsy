import { Box } from '@mui/material';
import TopBar from '../app-bar/app-bar';
import DrawerComponent from '../drawer-component/drawer-component';
import styles from './layout.module.scss';
import { Component, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';


/* eslint-disable-next-line */
export interface LayoutProps {
}

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
    <div >
      <TopBar />
      <div className={styles['container']}>
        <DrawerComponent />
        <div className={styles['outlet']}>
          <Outlet/>
        </div>
      </div>
      
    </div>
  );
}

export default Layout;
