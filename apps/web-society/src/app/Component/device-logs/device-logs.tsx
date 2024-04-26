import styles from './device-logs.module.scss';
import { environment } from '../../../environments/environment';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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
  card: {
      number: string,
      type: string,
      flat: {
         number: string
      },
  },
  status: string,
  direction: string,
  dateTime: Date
}

export function DeviceLogs({ id, refreshLogs }: DeviceLogsProps) {
  const [deviceLog, setDeviceLog] = useState<Response[]>([]);
  const apiUrl = environment.apiUrl;
  const user = useContext(UserContext);

  useEffect(() => {
    getDeviceLogs();
  }, [id, refreshLogs]);

  const getDeviceLogs = async () => {
    console.log("deviceId:", id);
    try {
      const response = await axios.get(`${apiUrl}/society/${user?.societyRoles[0].societyId}/reports/vehicle-logs`, {
        withCredentials: true,
        params: {
          deviceId: id,
          pageSize: 10,
          pageOffset: 0,
          sortBy: "dateTime",
          sortOrder: "desc",
          isPaginated: "true"
        },
      });

      // Update the vehiclelogs state with the API response
      setDeviceLog(response.data.content);
      console.log("Device logs:", response.data.content);
    } catch (error) {
      console.log("error in vehicle log", error);
    }
  }

  return (
    <div className={styles['container']} style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Gate Name</TableCell>
              <TableCell>Flat Number</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Vehicle Name</TableCell>
              <TableCell>Direction</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceLog.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.device.name}</TableCell>
                <TableCell>{item.vehicle ? item.vehicle?.flats[0].flats.number : 'Forced Open'}</TableCell>
                <TableCell>{item.vehicle?.number}</TableCell>
                <TableCell>{item.vehicle?.name}</TableCell>
                <TableCell>{item.direction}</TableCell>
                <TableCell>{new Date(item.dateTime).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.dateTime).toLocaleTimeString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}


export default DeviceLogs;
