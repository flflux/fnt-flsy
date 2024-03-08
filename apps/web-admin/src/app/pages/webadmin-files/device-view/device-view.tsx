/* eslint-disable react/jsx-no-useless-fragment */
import { Box } from '@mui/material';
import styles from './device-view.module.scss';
import { useEffect, useState } from 'react';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom'; 
import { VehicleDevice, ViewDevice } from '@fnt-flsy/data-transfer-types';
import { Device } from '@prisma/client';

/* eslint-disable-next-line */
export interface DeviceViewProps {}

export function DeviceView(props: DeviceViewProps) {

  const [data,setData]=useState<ViewDevice>(); 

  const { id } = useParams();
  const apiUrl = environment.apiUrl;

  useEffect(()=>{
   getdevices(id);
  },[]);

  useEffect(()=>{
     return
  },[data]);


  const getdevices=async(id:any)=>{
    try{
      console.log("id:",id);
      // const response=await axios.get(`${apiUrl}/vehicledevice/${id}`,{
      //   withCredentials:true
      // });
      const response=await axios.get(`${apiUrl}/devices/${id}`,{
        withCredentials:true
      });
      console.log(response.data);
      setData(response.data);
    }catch(error){
      console.error('Error fetching data:', error);
      setData([]);
    }

  }

  console.log("data:",data);
   
 
  return (
    <div className={styles['device-container']}>
      <h1>Welcome to DeviceView!</h1>

      {/* <div>
      {Array.isArray(data) && data.length > 0 ? (
      data.map((row: VehicleDevice, index: number) => (
          <div key={index}>
              <h1>Device Id: {row.id}</h1>
              <h1>Device Id: {row.deviceId}</h1>
              <h1>Device Id: {row.vehicleId}</h1>
            </div> 
      ))
      ):(
        <div>No content</div>
      )}
      </div> */}

 
      <div className={styles['fields']}>
        <div className={styles['fields-text']}><div>Society:</div> <div>{data?.society?.name}</div></div>
        <div className={styles['fields-text']}><div>Type:</div> <div>{data?.name}</div></div>
        {/* <div className={styles['fields-text']}><div>Type:</div> <div>{data?.}</div></div> */}
        <div className={styles['fields-text']}><div>Device_Id:</div> <div>{data?.deviceId}</div></div>
        <div className={styles['fields-text']}><div>ThingId:</div> <div>{data?.thingId}</div></div>
        <div className={styles['fields-text']}><div>Thing Key:</div> <div>{data?.thingKey}</div></div>
        <div className={styles['fields-text']}><div>channnel Id:</div> <div>{data?.channelId}</div></div>

        <div><Link to={`/device/${data?.id}/vehicles`} className={styles['controllername']} style={{textDecoration:"none",color:"black"}}>View linked Vehicles</Link></div>
      </div>
  

      
    </div>
  );
}

export default DeviceView;


