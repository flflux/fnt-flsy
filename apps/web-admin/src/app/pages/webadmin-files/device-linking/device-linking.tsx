import styles from './device-linking.module.scss';
import { environment } from '../../../environments/environment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { VehicleDevice } from '@fnt-flsy/data-transfer-types';

/* eslint-disable-next-line */
export interface DeviceLinkingProps {}


export interface VehicleData {
  vehicles: {
    id: number;
    name: string;
    number: string;
    isActive: boolean;
    type: string;
  };
}


export function DeviceLinking(props: DeviceLinkingProps) {
  const { id } = useParams();
  const [data, setData] = useState<VehicleData[] | null>(null);
  const apiUrl = environment.apiUrl;

  useEffect(()=>{
   getdeviceVehicle(id);
  },[]);

  const getdeviceVehicle=async(id:any)=>{
    try{
      console.log("id:",id);
      const response=await axios.get(`${apiUrl}/device/${id}/vehicles`,{
        withCredentials:true
      });
      console.log("device vehicle linking data:",response.data);
      setData(response.data);
      console.log(data)
    }catch(error){
      console.error('Error fetching data:', error);
      setData(null);
    }

  }


  
  return (
   
    <div className={styles['device-container']}>
      <h1>Welcome to DeviceView!</h1>
      <div>
        {data?.map((vehicle, index) => (
          <div key={index}>
            <h1>Vehicle id: {vehicle.vehicles.id}</h1>
            <h1>Vehicle name: {vehicle.vehicles.name}</h1>
            <h1>Vehicle number: {vehicle.vehicles.number}</h1>
            <h1>Vehicle type: {vehicle.vehicles.type}</h1>
            <br/>
          </div> 
        ))}
      </div>
      
    </div>
  );
}

export default DeviceLinking;
