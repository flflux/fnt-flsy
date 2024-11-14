import { Box, Button, Checkbox, CircularProgress, FormControl, FormLabel, Grid, Modal, Paper, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import styles from './devices.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import { Device, Vehicle, ViewDevice, ViewVehicle } from '@fnt-flsy/data-transfer-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { environment } from '../../../../environments/environment';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import AddControllerComponent from '../../list-controller/add-controller/add-controller';
import DeleteControllerComponent from '../../list-controller/delete-modal/delete-modal';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext, UserContext } from "../../../contexts/user-context";

/* eslint-disable-next-line */
export interface DevicesProps {
  id: string | undefined,
}


// interface Response {
//   devices: Device[];
// }
// interface Device {
//   channelId: string;
//   createdAt: string;
//   deviceBankId: null;
//   deviceId: string;
//   deviceKey: string;
//   id: number;
//   isActive: boolean;
//   isDeviceKeyExempt: boolean;
//   lastSyncTimestamp: number;
//   name: string;
//   siteId: null;
//   societyId: number;
//   thingId: string;
//   thingKey: string;
//   type: string;
//   updatedAt: string;
// }




export function Devices() {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [selectedDeviceList, setSelectedDeviceList] = useState<Device[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = environment.apiUrl;
  const params = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ControllerToDeleteId, setControllerToDeleteId] = useState<number | null>(null);
  const { reset } = useForm();
  const user = useContext(UserContext);
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const societycontext = useContext(SocietyContext);
  //console.log("society context:",societycontext);
  console.log("society id:", societycontext?.id);


  useEffect(() => {
    getVehicleDevices();
  }, [user, societycontext]);

  useEffect(() => {
    getSelectedDevices();
  }, []);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (ControllerId: number) => {
    setControllerToDeleteId(ControllerId);
    console.log("VehicleToDeleteId:", ControllerToDeleteId);
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setControllerToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  const getVehicleDevices = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/devices`,
        {
          withCredentials: true,
        });
      console.log("Vehicle devices:", response.data.content);
      const activeDevices = response.data.content.filter((device: Device) => device.type === "ACCESS");
      // setDeviceList(response.data.content);
      setDeviceList(activeDevices);
      setLoading(false);

    } catch (error) {
      console.log("Error in fetching Vehicle Device", error);
      setLoading(false);
    }
  }


  const getSelectedDevices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/vehicles/${params.id}/devices`,
        {
          withCredentials: true,
        });
      console.log("Selected devices:", response.data.content);
      setSelectedDevices(response.data.content.map((d: any) => d.devices.id))
    } catch (error) {
      console.log("Error in fetching Vehicle Device", error);
    }
  }


  const handleAddController = async (
    stringDeviceId: number
    //   formData: {
    //   name: string;
    //   deviceKey: string;
    //   type: string;
    //   deviceId: string;
    // }
  ) => {
    try {
      const selectedDeviceIds = selectedDevices;

      // console.log("handleAddController",{ deviceId: stringDeviceId }, `${apiUrl}/societies/${societycontext?.id}/vehicle/${params.id}/device`)

      const { data } = await axios.post(
        `${apiUrl}/societies/${societycontext?.id}/vehicle/${params.id}/device`,
        { deviceId: stringDeviceId },
        {
          withCredentials: true,
        }
      );

      if (data) {
        setIsAddModalOpen(false);
        getVehicleDevices();
        enqueueSnackbar("Device added successfully!", { variant: "success" });
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log("handleAddController err", error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 400) {
            const errorResponseData = axiosError.response.data as { message: string };
            console.log('Error message:', errorResponseData.message);
            enqueueSnackbar(`Error: ${errorResponseData.message}`, { variant: 'error' });
          } else {
            console.log('Request failed with status code 400:', axiosError.response.data);
            enqueueSnackbar('Request failed with status code 400', { variant: 'error' });
          }
        } else {
          console.log('Request failed with status code 400');
          enqueueSnackbar('Request failed with status code 400', { variant: 'error' });
        }
      } else {
        console.log('Something went wrong');
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    }
  };

  //delete Device

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/device/${Id}/vehicle/${params.id}`, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Flat DeActive successfully')
      enqueueSnackbar("Device Removed successfully!", { variant: 'success' });
      getVehicleDevices();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong")
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 400) {
            const errorResponseData = axiosError.response.data as { message: string };
            console.log('Error message:', errorResponseData.message);
            enqueueSnackbar(`Error: ${errorResponseData.message}`, { variant: 'error' });
          } else {
            console.log('Request failed with status code 400:', axiosError.response.data);
            enqueueSnackbar('Request failed with status code 400', { variant: 'error' });
          }
        } else {
          console.log('Request failed with status code 400');
          enqueueSnackbar('Request failed with status code 400', { variant: 'error' });
        }
      } else {
        console.log('Something went wrong');
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    }
  }





  const toggleDeviceSelection = (deviceId: number) => {
    const stringDeviceId = deviceId;
    if (selectedDevices.includes(stringDeviceId)) {
      setSelectedDevices((prevState) => prevState.filter((did) => did !== deviceId))
      handleDelete(stringDeviceId);
    } else {
      setSelectedDevices((prevSelectedDevices) => [...prevSelectedDevices, stringDeviceId]);
      handleAddController(stringDeviceId);
    }
  };

  function formatDeviceType(type: string) {
    switch (type) {
      case 'ACCESS':
        return 'Access';
      case 'MONOCON':
        return 'Moncon';
      default:
        return type;
    }
  }



  return (
    <Box>
      <Box>
        {/* <AddControllerComponent
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddController}
        /> */}
      </Box>
      <TableContainer sx={{ maxHeight: 440, overflow: 'auto' }} >
        <Table stickyHeader>
          <TableHead>
            <TableRow >
              <TableCell>
                <h3>Device Details:</h3>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align='center'>

                {/* <Button
                  className={styles['add_btn']}
                  onClick={() => {
                    //  openAddModal();
                    setIsAddModalOpen(true);  
                  }}
                >
                  <AddIcon fontSize='small' />Add
                </Button> */}

              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {loading ? (
              <TableCell align='center' colSpan={5}>
                <CircularProgress />
              </TableCell>
            ) : (Array.isArray(deviceList) && deviceList.length > 0 ? (
              deviceList.map((Device: Device, index: number) => (
                <TableRow key={index}>
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell align='center'>
                    {Device?.name}
                  </TableCell>
                  <TableCell align='center'>
                    {Device?.deviceId}
                  </TableCell>
                  <TableCell align='center'>
                    {formatDeviceType(Device?.type)}
                  </TableCell>

                  <TableCell align='center' sx={{ pr: 15 }}>
                    {/* <EditIcon sx={{ mr: 1 }} className="btn btn-primary"
                    >
                      Edit
                    </EditIcon> */}
                    {/* <DeleteIcon sx={{ ml: 1 }} className="btn btn-danger" color="error" onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(Device?.id)
                    }}
                    >
                      Delete
                    </DeleteIcon> */}
                    <Checkbox
                      //  checked={selectedDeviceList.some((selectedDevice) => selectedDevice.id === Device?.id)}
                      checked={selectedDevices.includes(Device?.id)}
                      onChange={() => toggleDeviceSelection(Device.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }} colSpan={5}>No Devices found</TableCell>
              </TableRow>
            )
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <DeleteControllerComponent
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={() => {
          handleDelete(ControllerToDeleteId);
          closeDeleteModal();
        }}
      />
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Paper>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Vehicle Details</FormLabel>
                  <TextField
                    label="Name"
                    name="name"
                  // value={NAme}
                  // onChange={handleInputChange}
                  />
                  <TextField
                    label="Number"
                    name="number"
                  // value={newVehicle.number}
                  // onChange={handleInputChange}
                  />
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Vehicle Type</FormLabel>
                    <RadioGroup
                      name="type"
                    // value={newVehicle.type}
                    // onChange={handleInputChange}
                    >
                      {/* <FormControlLabel value="Car" control={<Radio />} label="Car" />
                      <FormControlLabel value="Motorcycle" control={<Radio />} label="Motorcycle" /> */}
                    </RadioGroup>
                  </FormControl>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                {/* <Button variant="contained" onClick={handleAddVehicle}>
                  Add Vehicle
                </Button> */}
                <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Modal>







    </Box>


  );
}

export default Devices;
