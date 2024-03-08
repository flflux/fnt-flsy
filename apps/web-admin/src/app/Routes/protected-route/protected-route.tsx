import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/user-contexts';
import styles from './protected-route.module.scss';
import { useContext, useEffect } from 'react';

/* eslint-disable-next-line */
export interface ProtectedRouteProps {
  Component: React.ComponentType;
}

export function ProtectedRoute({Component}: ProtectedRouteProps) {
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
      <Component/>
    </div>
  );
 
}

export default ProtectedRoute;
