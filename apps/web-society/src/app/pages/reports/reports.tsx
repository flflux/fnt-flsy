import { Box, Button, Card, CardActions, CardContent, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import styles from './reports.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Device, Vehicle } from '@fnt-flsy/data-transfer-types';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { environment } from '../../../environments/environment';
import { SocietyContext, UserContext } from '../../contexts/user-context';
import { useParams } from 'react-router-dom';
import { VehicleType } from '@prisma/client';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import theme from '../../theme';
import { DateTimePicker } from '@mui/x-date-pickers';
import { auto } from '@popperjs/core';



/* eslint-disable-next-line */
export interface ReportsProps { }

interface ViewVehicle {
  id: number;
  name: string;
  number: string;
  type: string;
  isActive: boolean;
  vehicles: Vehicle;
  flats: [
    {
      flats: {
        id: number,
        number: string;

        floor: {
          id: number;
          number: string;

          building: {
            id: number;
            name: string;
            society: {
              id: number;
              name: string
            };
          }
        }
      }
    }];
};

interface VehicleLog {
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

interface Form {
  vehicleId: number;
  deviceId: number;
  startDate: Date;
  endDate: Date;
}

interface DeviceForm {
  deviceId: number;
}

interface VehicleTypeForm {
  type: VehicleType;
}

interface DirectionForm {
  direction: string;
}



const columns: GridColDef[] = [
  { field: 'vehicle', headerName: 'Vehicle Name', width: 100, flex: 1 },
  // {field:'id', headerName:"Id", width:90},
  {
    field: 'device',
    headerName: 'Gate',
    width: 100,
    editable: false,
    flex: 1
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 100,
    editable: false,
    flex: 1
  },
  {
    field: 'type',
    headerName: 'Vehicle Number',
    width: 100,
    editable: false,
    flex: 1
  },
  {
    field: 'direction',
    headerName: 'Direction',
    type: 'number',
    width: 100,
    editable: false,
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    type: 'number',
    width: 100,
    editable: false,
    flex: 1,
    // maxWidth:200
  },
];




// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

export function Reports(props: ReportsProps) {

  const [VehicleList, setVehicleList] = useState<ViewVehicle[]>([]);
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [vehiclelogs, setVehiclelogs] = useState<VehicleLog[]>([]);
  const apiUrl = environment.apiUrl;
  const user = useContext(UserContext);
  const params = useParams();

  const societycontext = useContext(SocietyContext);
  console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);




  const columnWidth = 1000 / columns.length;

  // Set the width dynamically for each column
  const columnsWithWidth = columns.map((col) => ({ ...col, width: columnWidth }));



  const rows = vehiclelogs.map((log) => {



    return {
      id: log.id,
      vehicle: log.vehicle.name, // Assuming you have a 'name' property for the vehicle
      device: log.device.name, // Assuming you have a 'name' property for the device
      date: log.dateTime,
      type: log.vehicle.number,
      direction: log.direction,
      status: log.status,
    }
  })


  const validationSchema = yup.object().shape({
    vehicleId: yup.number(),
    deviceId: yup.number()
  });
  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<Form>({
    resolver: yupResolver(validationSchema),
  });
  const onFormSubmit = async (data: any) => {
    console.log(data.deviceId);
    console.log(data.vehicleId);
    console.log(data);
    try {
      const response = await axios.get(`${apiUrl}/society/${societycontext?.id}/reports/vehicle-logs`, {
        withCredentials: true,
        params: {
          deviceId: data.deviceId,
          vehicleId: data.vehicleId,
          startDate: data.startDate,
          enddate: data.endDate,
          pageSize: 10,
          pageOffset: 0,
          sortBy: "dateTime",
          sortOrder: "desc",
          isPaginated: "true"
        },
      });

      // Update the vehiclelogs state with the API response
      setVehiclelogs(response.data.content);
      console.log("Vehicle logs:", response.data)
    } catch (error) {
      console.log("error in vehicle log", error);
    }
  }

  const getAllVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/vehicles`, {
        withCredentials: true,
      });
      const { content } = response.data;
      setVehicleList(content);

      console.log("Vehicle list:", response.data.content);
      console.log("Vehicle id:", response.data.content[0].id);
      console.log("Flat id:", response.data.content[0].flats[0].flats.id);
      console.log("Floor id:", response.data.content[0].flats[0].flats.floor.id);
      console.log("Building id:", response.data.content[0].flats[0].flats.floor.building.id);
      console.log("Society id:", response.data.content[0].flats[0].flats.floor.building.society.id);

    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
    }
  };


  const getDevices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/devices`,
        {
          withCredentials: true,
        });
      console.log("Vehicle devices:", response.data.content);
      setDeviceList(response.data.content);
      // console.log("devices response:", response.data[0].devices.name);
    } catch (error) {
      console.log("Error in fetching Vehicle Device", error);
    }

  }

  const generateRandomData = () => {
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);

    const date = new Date();
    date.setHours(randomHour, randomMinute, 0, 0);

    return {
      id: Math.floor(Math.random() * 1000),
      vehicle: `Vehicle-${Math.floor(Math.random() * 1000)}`,
      device: `Device-${Math.floor(Math.random() * 1000)}`,
      date: date.toISOString(),
      type: Math.random() > 0.5 ? 'TWO_WHEELER' : 'FOUR_WHEELER',
      direction: Math.random() > 0.5 ? 'In' : 'Out',
      status: Math.random() > 0.5 ? 'Active' : 'Inactive',
    };

  };


  const handleDataExport = () => {
    console.log('Exporting data...');
    // Add your export logic here
  };





  // const data = Array.from({ length: 10 }, (_, index) => generateRandomData());

  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      label: 'Report',
    },
  ];

  useEffect(() => {
    getAllVehicles();
    getDevices();
    // onSubmit();
  }, [user, societycontext]);

  return (
    <div className={styles['container']}>
      <div className={styles['breadcrumb']}><Breadcrumbs paths={breadcrumbs} /></div>
      <h1 className={styles['h1_tag']}>Vehicle Reports</h1>



      {/* cards */}
      {/* onSubmit={handleVehicleSubmit} */}
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box className={styles['report-dropdown']}>
          {/* <Box className={styles['dropdown']}> */}
          {/* <Box> */}
          {/* <FormControl sx={{ width: 300 , 
             '@media (max-width: 758px)': {
                width:'100% !important',
              },}} fullWidth>
              <InputLabel htmlFor="floor">Select Vehicle</InputLabel>
              <Controller
                name="vehicleId"
                control={control} */}
          {/* // defaultValue={undefined} */}
          {/* rules={{ required: 'Vehicle Number is required' }}
                render={({ field }) => (
                  <>
                  <Select
                    label="Select Vehicle"
                    variant="outlined"
                    {...field} */}
          {/* error={!!vehicleErrors.vehicleId} */}
          {/* MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 105
                        },
                      },
                    }}
                  > */}
          {/* {VehicleList.map((vehicle) => (
                      <MenuItem sx={{ justifyContent: 'center' }} key={vehicle.id} value={Number(vehicle.id)}>
                        {vehicle.number}
                      </MenuItem>
                    ))}
                  </Select> */}
          {/* <FormHelperText sx={{ color: "#d32f2f" }}>{vehicleErrors.vehicleId?.message}</FormHelperText> */}
          {/* </> */}
          {/* )} />
            </FormControl> */}
          {/* </form> */}
          {/* </Box> */}



          {/* onSubmit={handleDeviceSubmit} */}
          {/* <form > */}
          <Box>
            <FormControl sx={{
              width: 300,
              '@media (max-width: 758px)': {
                width: '100% !important',
              },
            }} fullWidth>

              <InputLabel htmlFor="Device">Select Device</InputLabel>
              <Controller
                name="deviceId"
                control={control}
                // defaultValue=""
                rules={{ required: 'Device is required' }}
                render={({ field }) => (
                  <><Select
                    label="Select Device"
                    variant="outlined"
                    {...field}
                    // error={!!deviceErrors.deviceId}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 105
                        },
                      },
                    }}
                  >
                    {deviceList.map((device) => (
                      <MenuItem sx={{ justifyContent: 'center' }} key={device.id} value={device.id}>
                        {device.name}
                      </MenuItem>
                    ))}
                  </Select>
                    {/* <FormHelperText sx={{ color: "#d32f2f" }}>{errors.deviceId?.message}</FormHelperText> */}
                  </>

                )} />
            </FormControl>
          </Box>
          {/* </Box> */}
          {/* </form> */}


          {/* <Box className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  <InputLabel id="vehicletype" htmlFor="vehicletype">Vehicle Type</InputLabel>
                  <Controller
                    name="type"
                    control={vehicleTypeControl}
                    rules={{ required: 'Vehicle Type is required' }}
                    render={({ field }) => (
                      <Select
                        // labelId="Resident Type"
                        id="vehicle type"
                        label="Vehicle Type"
                        variant='outlined'
                        {...field}
                        error={!!vehicleTypeErrors.type}
                        // helperText={errors.type?.message}
                        // native={true}
                        sx={{mt:"3px"}}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 90
                            },
                          },
                        }}
                      >
                        <MenuItem sx={{ justifyContent: "start" }} value="TWO_WHEELER" >Two Wheeler</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="FOUR_WHEELER">Four Wheeler</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="OTHER">Other</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "#d32f2f" }}>{!!vehicleTypeErrors.type?.message}</FormHelperText>
                </FormControl>
              </Box> */}


          {/* <Box className={styles['grid_top']}>
                <FormControl sx={{ width: 260 }}>
                  <InputLabel id="direction" htmlFor="direction">Direction</InputLabel>
                  <Controller
                    name="direction"
                    control={DirectionControl}
                    rules={{ required: 'Direction is required' }}
                    render={({ field }) => (
                      <Select
                        // labelId="Resident Type"
                        id="direction"
                        label="Direction"
                        variant='outlined'
                        {...field}
                        error={!!DirectionErrors.type}
                        // helperText={errors.type?.message}
                        // native={true}
                        sx={{mt:"3px"}}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 90
                            },
                          },
                        }}
                      >
                        <MenuItem sx={{ justifyContent: "start" }} value="TWO_WHEELER" >In</MenuItem>
                        <MenuItem sx={{ justifyContent: "start" }} value="FOUR_WHEELER">Out</MenuItem>

                      </Select>
                    )}
                  />
                  <FormHelperText sx={{ color: "#d32f2f" }}>{!!vehicleTypeErrors.type?.message}</FormHelperText>
                </FormControl>
              </Box> */}

          {/* <Box className={styles['date-box']}> */}
          <Box sx={{
            marginTop: '-7px', width: 300, '@media (max-width: 758px)': {
              width: '100% !important',
            }
          }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker']}>
                <Controller
                  name="startDate"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <DateTimePicker {...field} label="Start Date"
                    />
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          {/* <span className={styles['dash']}>-</span> */}
          <Box sx={{
            marginTop: '-7px', width: 300, '@media (max-width: 758px)': {
              width: '100% !important',
            }
          }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoContainer components={['DatePicker']} >
                <Controller
                  name="endDate"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <DateTimePicker {...field} label="End Date" />
                  )}

                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>
          {/* </Box> */}



        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: "10px" }}>
          <Button variant="contained" color="primary" type="submit">
            Generate
          </Button>
          <Button variant="contained" color="primary" onClick={()=>{handleDataExport()}}>
            Export
          </Button>
        </Box>




      </form>


      {/*     
 <div className={styles['horizontal-line']} />  */}


      <Box sx={{
        height: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('sm')]: {
          flexDirection: 'row', // Change to row on small screens and above
        },
      }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            [theme.breakpoints.down('sm')]: {
              '.MuiCheckbox-root': {
                width: 24, // Adjust the checkbox width as needed
                height: 24, // Adjust the checkbox height as needed
              },
              '.MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                whiteSpace: 'nowrap',
                fontSize: '0.6rem', // Adjust the font size as needed
                [theme.breakpoints.up('sm')]: {
                  fontSize: '0.6rem', // Adjust the font size for larger screens
                },
              },
            },
          }}
        />
      </Box>

    </div>
  );
}

export default Reports;
