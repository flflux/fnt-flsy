import styles from './vehicles.module.scss';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, Select, MenuItem, InputLabel, FormControl, FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Grid, CircularProgress, IconButton } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Vehicle } from '@fnt-flsy/data-transfer-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { environment } from '../../../../environments/environment';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import DeleteVehicleComponent from '../../list-vehicle/delete-vehicle/delete-vehicle';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar, useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext, UserContext } from "../../../contexts/user-context";
import AddVehicleComponent from '../../view-devices/add-vehicle/add-vehicle';

/* eslint-disable-next-line */
export interface VehiclesProps {
  id:string | undefined,
}

interface Response {
  vehicles: Vehicle
}


interface ViewVehicle {
  id: number;
  name: string;
  number: string;
  type: string;
  isActive: boolean;
  vehicles:Vehicle;
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
}

interface Form {
  vehicleId: number;
}

export function Vehicles({ id }: VehiclesProps) {
  const [VehicleDeviceList, setVehicleDeviceList] = useState<ViewVehicle[]>([]);
  const [VehicleList, setVehicleList] = useState<ViewVehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<number | null>(null);
  const apiUrl = environment.apiUrl;
  const user=useContext(UserContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteData, setDeleteData] = useState<ViewVehicle | null>(null);

  const params=useParams();
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = yup.object().shape({
    vehicleId: yup.number().required('Vehicle Number is required'),
  });
  const { handleSubmit, reset, control, formState: { errors } } = useForm<Form>({
    resolver: yupResolver(validationSchema)
  });

  const societycontext=useContext(SocietyContext);
  //console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);


  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

    // Function to open the delete confirmation modal
    const openDeleteModal = (VehicleId:number) => {
      const selectedVehicle: ViewVehicle | undefined = VehicleDeviceList.find(
        (vehicles) => vehicles.vehicles.id === VehicleId
      );
  
      if (selectedVehicle) {
      setDeleteData(selectedVehicle);
      setVehicleToDeleteId(VehicleId);
      console.log("VehicleToDeleteId:", VehicleToDeleteId);
      setIsDeleteModalOpen(true);
      }
    };

  const handleAddVehicle = async () => {
    // try {
    //   // Send a POST request to add the new vehicle
    //   const response = await axios.post(`${apiUrl}/add-vehicle-endpoint`, newVehicle);
    //   // Add the newly added vehicle to the list if the request is successful
    //   setVehicleList([...VehicleList, { vehicles: newVehicle }]);
    //   setIsModalOpen(false);
    // } catch (error) {
    //   console.log('Error in adding Vehicle', error);
    // }
  };



  const getVehicleDevices = async () => {
    try {
      setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/device/${id}/vehicles`,
        {
          withCredentials: true,
        });
      console.log("Vehicle devices:", response.data.content);
      setVehicleDeviceList(response.data.content);
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching Vehicle Device", error);
      setLoading(false);
    }

  }

 
  useEffect(() => {
    getVehicleDevices();
  }, [user, societycontext]);

  const addVehicle = async (formData: { vehicleId: number }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/device/${params.id}/vehicle`,
        { vehicleId: formData.vehicleId },
        {
          withCredentials: true,
        })
      if (data) {
        setIsAddModalOpen(false);
        enqueueSnackbar("Vehicle added successfully!", { variant: 'success' });
        getVehicleDevices();
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
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
  const addedNewVehicle = async (formData: { vehicleId: number }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/device/${params.id}/vehicle`,
        { vehicleId: formData.vehicleId },
        {
          withCredentials: true,
        })
      if (data) {
        setIsAddModalOpen(false);
        // enqueueSnackbar("Vehicle added successfully!", { variant: 'success' });
        getVehicleDevices();
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
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

  //Add a New Vehicle

  const addNewVehicle = async (formData: {
    buildingId: number;
    floorId: number;
    flatId: number;
    number: string;
    name: string;
    type: string;
    isActive: boolean;
  }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flat/${formData.flatId}/vehicles`,
        { name: formData.name, number: formData.number, type: formData.type, isActive: formData.isActive },
        {
          withCredentials: true,
        })
      if (data) {
        // getAllVehicles();
        enqueueSnackbar("Vehicle added successfully!", { variant: 'success' });
      } else {
        console.log("Something went wrong");
      }
      console.log("Vehicle added successfully", data);
    } catch (error) {
      console.log("Something went wrong in input form", error);
      enqueueSnackbar("Something went wrong!", { variant: 'error' });
    }
  };

 

    //delete a Vehicle

    const handleDelete = async (Id: any) => {
      try {
        const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/device/${params.id}/vehicle/${Id}`, {
          withCredentials: true,
        }
        );
        console.log("delete:", data);
        // console.log(Id)
        console.log('Vehicle DeActived successfully');
        enqueueSnackbar("Vehicle removed successfully!", { variant: 'success' });
        getVehicleDevices();
      } catch (error) {
        console.log(error)
        console.log("Something went wrong");
        enqueueSnackbar("Vehicle updated successfully!", { variant: 'error' });
      }
    }

    
  function formatVehicleType(type: string) {
    switch (type) {
        case 'TWO_WHEELER':
            return 'Two Wheeler';
        case 'FOUR_WHEELER':
            return 'Four Wheeler';
        case 'OTHER':
            return 'Other';
        default:
            return type; 
    }
}

  return (
    <div className={styles['container']}>
      <TableContainer sx={{ maxHeight: 440, overflow: 'auto'}} id={styles['Resident-container']}>
        <Table stickyHeader className={styles['Resident-table']}>
          <TableHead>
            <TableRow className={styles['headerStyles']}>
              <TableCell>
                <h3 id={styles['resident_detail']}>Vehicles Details:</h3>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell align='center'>
                <Button
                  className={styles['add_btn']}
                  // onClick={handleAddClick}
                  onClick={() => {
                    reset();
                    handleAddClick();
                  }}
                >
                  <AddIcon fontSize='small' />Add
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles['table-body']}>
          {loading ? (
                <TableCell align='center' colSpan={5}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(VehicleDeviceList) && VehicleDeviceList.length > 0 ? (
              VehicleDeviceList.map((Vehicle: ViewVehicle, index: number) => (
                <TableRow key={index}>
                  {/* <TableCell>{index + 1}</TableCell> */}
                  <TableCell align='center'>
                    {Vehicle.vehicles.name}
                  </TableCell>
                  <TableCell align='center'>
                    {Vehicle.vehicles.number}
                  </TableCell>
                  <TableCell align='center'>
                    {formatVehicleType(Vehicle.vehicles.type)}
                  </TableCell>

                  <TableCell align='center' colSpan={2}>
                    {/* <EditIcon sx={{ mr: 1 }} className="btn btn-primary"
                    >
                      Edit
                    </EditIcon> */}
                    <IconButton classes="btn btn-danger" className={styles['row-action-button']} color="error" onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(Vehicle.vehicles?.id)
                      }}>
                      <DeleteIcon>
                        Delete
                      </DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }} colSpan={5}>No Vehicles found</TableCell>
              </TableRow>
         )
         )}
          </TableBody>
        </Table>
      </TableContainer>


      <AddVehicleComponent
       open={isAddModalOpen}
       onClose={() => setIsAddModalOpen(false)}
       onSubmit={addNewVehicle}
       onExistSubmit={addVehicle}
       newAddVehicle={addedNewVehicle}
      />

      <Modal open={isDeleteModalOpen} onClose={handleDeleteCloseModal}>
      <Box className={styles['delete_modal_container']}>
        <h2 className={styles['h2_tag']}>Remove Vehicle</h2>
        <p>Are you sure you want to Remove this <b>{deleteData?.vehicles?.name}</b> vehicle?</p>
        <Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteCloseModal}
          >
            Cancel
          </Button>
          <Button
          className={styles['delete_btn']}
            sx={{ ml: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              handleDelete(VehicleToDeleteId);
            handleDeleteCloseModal();
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
    </div >
  );
}

export default Vehicles;
