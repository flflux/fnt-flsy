import { useContext, useEffect, useState } from 'react';
import styles from './all-vehicle-logs.module.scss';
import { environment } from '../../../environments/environment';
import { UserContext } from '../../contexts/user-contexts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';

/* eslint-disable-next-line */
export interface AllVehicleLogsProps {}

interface Response {
  id: number;
  device: {
    id: number;
    name: string;
    deviceId: string;
  };
  vehicle?: {
    id: number;
    name: string;
    number: string;
    flats: [
      {
        flats: {
          id: number;
          number: string;
        };
      }
    ];
  };
  card: {
    number: string;
    type: string;
    flat: {
      number: string;
    };
  };
  status?: string;
  direction?: string;
  dateTime: Date;
}

export function AllVehicleLogs(props: AllVehicleLogsProps) {

  const [allvehiclelog, setallvehiclelog]=useState<Response[]>([]);
  

  const apiUrl = environment.apiUrl;

  const society=useContext(UserContext);

  useEffect(()=>{
    getDeviceLogs();
  },[]);

  const getDeviceLogs=async()=>{
    try{
      const response = await axios.get(`${apiUrl}/vehicle-logs/society/${society?.id}/reports/vehicle-logs`, {
        withCredentials: true,
        params: {
          pageSize:10,
          pageOffset:0,
          sortBy:"createdAt",
          sortOrder:"desc",
          isPaginated:"true"
        },
      });

      // Update the vehiclelogs state with the API response
      setallvehiclelog(response.data.content);
      console.log("All vehicle logs:",response.data.content);
    }catch(error){
      console.log("Error in  All vehicle log", error);
    }
  }


  return (
    <div className={styles['container']} style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {allvehiclelog.map((item) => (
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
              <Typography
                variant="body2"
                component="div"
                className={styles['logs-card-text']}
              >
                <div className={styles['logs-name']}>
                  {item.card ? item.card?.number : 'Forced Open'}
                </div>
                <div id={styles['dateTime']}>{item.dateTime.toString()}</div>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className={styles['logs-card-text']}
              >
                <div>{item.device.name}</div>
                <div>{item.card?.type}</div>
                <div>{item.direction}</div>
              </Typography>
            </CardContent>
            </Card>
            ))}
    </div>
  );
}

export default AllVehicleLogs;

