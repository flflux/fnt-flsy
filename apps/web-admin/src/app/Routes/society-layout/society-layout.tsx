import { useEffect, useState } from 'react';
import styles from './society-layout.module.scss';
import { Society } from '@fnt-flsy/data-transfer-types';
import { environment } from '../../../environments/environment';
import { Outlet, useParams } from 'react-router-dom';
import { SocietyContext } from '../../contexts/user-contexts';
import axios from 'axios';

/* eslint-disable-next-line */
export interface SocietyLayoutProps {}

export function SocietyLayout(props: SocietyLayoutProps) {
  const [societyContext, setSocietyContext]=useState<Society | null>(null);
  const [society,setSociety]=useState<Society | null>(null);

  const apiUrl = environment.apiUrl;

 

  const { societyId } = useParams<{ societyId: string }>();
  console.log("society id:",societyId);

  const params=useParams();

  // useEffect(()=>{
  //   getSociety();
  // },[]);

  useEffect(()=>{
    const getSociety=async()=>{
      try{
        const response=await axios.get(`${apiUrl}/societies/${params.societyId}`,{
          withCredentials:true
        });
        console.log("Current society:",response.data);
        setSociety(response.data);
        setSocietyContext(response.data);
      }catch(error){
        console.log("Error in fetching society list",error);
      }
      
    } 
    getSociety();
  },[societyId]);


  return (
    <SocietyContext.Provider value={societyContext}>
       <Outlet/>
    </SocietyContext.Provider>
  );
}

export default SocietyLayout;
