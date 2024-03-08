import { useContext, useEffect, useState } from 'react';
import styles from './all-vehicle-logs.module.scss';
import { environment } from '../../../environments/environment';
import { SocietyContext, UserContext } from '../../contexts/user-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CircularProgress, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface AllVehicleLogsProps {
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

export function AllVehicleLogs({refreshLogs}: AllVehicleLogsProps) {

  const [allvehiclelog, setallvehiclelog]=useState<Response[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const apiUrl = environment.apiUrl;

  const user=useContext(UserContext);
  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);


  useEffect(()=>{
    getDeviceLogs();
  },[refreshLogs, societycontext]);

  const params=useParams();
  console.log("params:",params);

  const userContext = useContext(UserContext);
  console.log("user Context:",userContext);
  

  const getDeviceLogs=async()=>{
    try{
      setLoadingLogs(true);
        // await new Promise((resolve) => setTimeout(resolve, 4000));
      const response = await axios.get(`${apiUrl}/vehicle-logs/society/${societycontext?.id}/reports/vehicle-logs`, {
        withCredentials: true,
        params: {
          pageSize:10,
          pageOffset:0,
          sortBy:"dateTime",
          sortOrder:"desc",
          isPaginated:"true"
        },
      });

      // Update the vehiclelogs state with the API response
      setallvehiclelog(response.data.content);
      console.log("All vehicle logs:",response.data.content);
      setLoadingLogs(false);
    }catch(error){
      console.log("Error in  All vehicle log", error);
      setLoadingLogs(false);
    }
  }


  return (
    <div className={styles['container']}>
      {loadingLogs ? (
      <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", height:"25vh"}}><CircularProgress /></div>
      ):(
      allvehiclelog.map((item) => (
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
                  <div className={styles['logs-name']}>{item.vehicle.name}</div>
                  <div id={styles['dateTime']}>{item.dateTime}</div>
                </Typography>
                <Typography variant="body2" color="text.secondary" className={styles['logs-card-text']}>
                  <div>{item.vehicle.number}</div>      
                  <div>{item.device.name}</div>
                  <div>{item.direction}</div>
                </Typography>
              </CardContent>
            </Card>
            ))
            )}
    </div>
  );
}

export default AllVehicleLogs;
