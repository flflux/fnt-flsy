import { Typography } from '@mui/material';
import styles from './vehicle-logs.module.scss';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { SocietyContext, UserContext } from '../../contexts/user-context';

/* eslint-disable-next-line */
export interface VehicleLogsProps {
  id:number | undefined,
  refreshLogs:boolean
}

interface Response{
  id: number,
  device: {
    id: number,
    name: string,
    deviceId: string
  },
  vehicle: {
  id: number,
    name: string,
    number: string,
    flats: [
      {
        flats: {
          id: number,
          number: string
        }
      }
    ]
  },
  status: string,
  direction: string,
  dateTime: Date
}

export function VehicleLogs({id, refreshLogs}: VehicleLogsProps) {
  const [vehicleLog, setVehicleLog]=useState<Response[]>([]);
  const apiUrl = environment.apiUrl;


  const user=useContext(UserContext);

  const societycontext=useContext(SocietyContext);
  //console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);


  useEffect(()=>{
     getVehicleLogs();
  },[id,refreshLogs, societycontext]);

  
  const getRandomName = () => {
    // Replace this with a function that generates random names
    const names = ['John Doe', 'Jane Smith', 'Alice Johnson'];
    return names[Math.floor(Math.random() * names.length)];
  };
  
  const getRandomCarNumber = () => {
    // Replace this with a function that generates random car numbers
    return `MH01-XS-${Math.floor(Math.random() * 10000)}`;
  };
  
  const data = Array.from({ length: 3 }, (_, index) => ({
    id: index,
    name: getRandomName(),
    carNumber: getRandomCarNumber(),
    imageUrl: `https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90`,
  }));

  const getVehicleLogs=async()=>{
    console.log("vehicleId:",id);
    try{
      const response = await axios.get(`${apiUrl}/society/${societycontext?.id}/reports/vehicle-logs`, {
        withCredentials: true,
        params: {
          vehicleId: id,
          pageSize:10,
          pageOffset:0,
          sortBy:"dateTime",
          sortOrder:"desc",
          isPaginated:"true"
        },
      });

      // Update the vehiclelogs state with the API response
      setVehicleLog(response.data.content);
      console.log("Vehicle logs:",response.data.content);
    }catch(error){
      console.log("error in vehicle log", error);
    }
  }

  return (
    <div className={styles['container']}>
      <div>
            {vehicleLog.map((item) => (
              <Card
                key={item.id}
                className={styles['logs-card']}
                sx={{
                  display: 'flex',
                  maxWidth: 300,
                  border: '1px solid #ddd',
                  borderRadius: 5,
                  margin: 2, 
                }}
              >

                {item.status==='ALLOW' ? <div className={styles['active-logs']} /> : <div className={styles['inactive-logs']}/> }

                {/* <div className={styles['active-logs']} /> */}
                {/* <CardMedia
                  component="img"
                  height="140"
                  image={item.imageUrl}
                  alt="Image Description"
                  className={styles['cardmedia']}
                /> */}
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" component="div" className={styles['logs-card-text']}>
                    <div className={styles['logs-name']}>{item.vehicle.name}</div>
                    <div id={styles['dateTime']}>{item.dateTime.toString()}</div>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className={styles['logs-card-text']}>
                    <div>{item.vehicle.number}</div>      
                    <div>{item.device.name}</div>
                    <div>{item.direction}</div>
                  </Typography>
                </CardContent>
              </Card>
              ))}
          </div>
    </div>
  );
}

export default VehicleLogs;
