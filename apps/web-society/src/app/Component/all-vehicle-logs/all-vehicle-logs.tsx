import { useContext, useEffect, useState } from 'react';
import styles from './all-vehicle-logs.module.scss';
import { environment } from '../../../environments/environment';
import { SocietyContext, UserContext } from '../../contexts/user-context';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';
import { useParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface AllVehicleLogsProps {
  refreshLogs: boolean;
}

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

export function AllVehicleLogs({ refreshLogs }: AllVehicleLogsProps) {
  const [allvehiclelog, setallvehiclelog] = useState<Response[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const apiUrl = environment.apiUrl;
  const societycontext = useContext(SocietyContext);

  useEffect(() => {
    getDeviceLogs();
  }, [refreshLogs, societycontext]);

  const getDeviceLogs = async () => {
    try {
      setLoadingLogs(true);
      const response = await axios.get(
        `${apiUrl}/society/${societycontext?.id}/reports/vehicle-logs`,
        {
          withCredentials: true,
          params: {
            pageSize: 10,
            pageOffset: 0,
            sortBy: 'dateTime',
            sortOrder: 'desc',
            isPaginated: 'true',
          },
        }
      );
      setallvehiclelog(response.data.content);
      console.log('All vehicle logs:', response.data.content);
      setLoadingLogs(false);
    } catch (error) {
      console.log('Error in All vehicle log', error);
      setLoadingLogs(false);
    }
  };

  return (
    <div className={styles['container']} style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {loadingLogs ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '25vh',
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Gate Name</TableCell>
                <TableCell>Flat Number</TableCell>
                <TableCell>Vehicle Number</TableCell>
                <TableCell>Vehicle Type</TableCell>
                <TableCell>Direction</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allvehiclelog.map((item) => (
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
      )}
    </div>
  );
}


export default AllVehicleLogs;
