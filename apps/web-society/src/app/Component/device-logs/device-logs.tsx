import styles from './device-logs.module.scss';
import { environment } from '../../../environments/environment';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';

/* eslint-disable-next-line */
export interface DeviceLogsProps {
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

export function DeviceLogs({id, refreshLogs}: DeviceLogsProps) {
  const [deviceLog, setDeviceLog]=useState<Response[]>([]);
  const apiUrl = environment.apiUrl;

  const user=useContext(UserContext);

  useEffect(()=>{
    getDeviceLogs();
  },[id, refreshLogs]);

  const getDeviceLogs=async()=>{
    console.log("deviceId:",id);
    try{
      const response = await axios.get(`${apiUrl}/vehicle-logs/society/${user?.societyRoles[0].societyId}/reports/vehicle-logs`, {
        withCredentials: true,
        params: {
          deviceId: id,
          pageSize:10,
          pageOffset:0,
          sortBy:"dateTime",
          sortOrder:"desc",
          isPaginated:"true"
        },
      });

      // Update the vehiclelogs state with the API response
      setDeviceLog(response.data.content);
      console.log("Device logs:",response.data.content);
    }catch(error){
      console.log("error in vehicle log", error);
    }
  }

  return (
    <div className={styles['container']}>
    <div>
          {deviceLog.map((item) => (
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
              <div className={styles['active-logs']} />
              {/* <CardMedia
                component="img"
                height="140"
                image={item.imageUrl}
                alt="Image Description"
                className={styles['cardmedia']}
              /> */}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="body2" component="div" className={styles['logs-card-text']}>
                  <div className={styles['logs-name']}>{item.device.name}</div>
                  <div id={styles['dateTime']}>{item.dateTime}</div>
                </Typography>
                <Typography variant="body2" color="text.secondary" className={styles['logs-card-text']}>
                  <div>{item.vehicle.number}</div>      
                  <div>{item.vehicle.name}</div>
                  <div>{item.direction}</div>
                </Typography>
              </CardContent>
            </Card>
            ))}
        </div>
  </div>
  );
}

export default DeviceLogs;
