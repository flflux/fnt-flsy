import styles from './view-flat.module.scss';
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, Select, MenuItem, InputLabel, FormControl, FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Grid, Chip, CircularProgress, IconButton } from '@mui/material';
import { environment } from '../../../environments/environment';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Vehicle, AddVehicle, EditVehicle, ViewFlat, ViewFloor, Building, Resident, Flat, listResidentByFlat } from '@fnt-flsy/data-transfer-types';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import { ResidentType, VehicleType } from '@prisma/client';
import AddResidentComponent from '../list-resident/add-resident/add-resident';
import handleAddResident from "../list-resident/list-resident";
import AddVehicleComponent from '../list-vehicle/add-vehicle/add-vehicle';
import { useSnackbar } from 'notistack';
import EditResidentComponent from '../list-resident/edit-resident/edit-resident';
import handleUpdate from '../list-resident/list-resident';
import { EditForm } from '../list-resident/list-resident';
import DeleteResidentComponent from '../list-resident/delete-resident/delete-resident';
import AddFlatResidentComponent from './add-flat-resident/add-flat-resident';
import AddFlatVehicleComponent from './add-flat-vehicle/add-flat-vehicle';
import EditVehicleComponent from '../list-vehicle/edit-vehicle/edit-vehicle';
import DeleteFlatComponent from '../list-flats/delete-flats/delete-flats';

import DeleteVehicleComponent from '../list-vehicle/delete-vehicle/delete-vehicle';
import AddIcon from '@mui/icons-material/Add';
import ViewResidentComponent from '../view-resident/view-resident';
import { SocietyContext, UserContext } from "../../contexts/user-context";

/* eslint-disable-next-line */

interface Residentflat {
  flat: Flat,
  type: string
}

interface Response {
  id: number;
  flats: Residentflat[];
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  isActive: boolean;
}

interface FlatVehicle {
  flats: Flat[];
  id: number;
  isActive: boolean;
  name: string;
  number: string;
  type: VehicleType;
}

interface Form {
  buildingId: number;
  floorId: number;
  flatId: number;
  number: string;
  name: string;
  type: string;
  isActive: boolean;
}

interface ViewResident {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  buildingId: number;
  floorId: number,
  flatId: number,
  isActive: boolean;

  flats: [
    {
      type: string;
      isPrimary: boolean;
      flat: {
        id: number,
        number: string;

        floor: {
          id: number;
          number: string;

          building: {
            id: number;
            name: string;
            society: { id: number; name: string };
          }
        }
      }
    }];

}

interface ViewVehicle {
  id: number;
  name: string;
  number: string;
  type: string;
  isActive: boolean;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewFlatsProps { }


export function ViewFlats(props: ViewFlatsProps) {

  const [data, setData] = useState<ViewFlat | null>(null);
  const [vehicleData, setVehicleData] = useState<Form | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVehicleAddModalOpen, setIsVehicleAddModalOpen] = useState(false);
  const [activeFlatResidents, setActiveFlatResidents] = useState<ViewResident[]>([]);
  const [VehicleList, setVehicleList] = useState<ViewVehicle[]>([]);
  const [editData, setEditData] = useState<ViewResident | null>(null);
  const [deleteResidentData, setDeleteResidentData] = useState<ViewResident | null>(null);
  const [vehicleEditData, setVehicleEditData] = useState<ViewVehicle | null>(null);
  const [vehicleDeleteData, setVehicleDeleteData] = useState<ViewVehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVehicleEditModalOpen, setIsVehicleEditModalOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteResidentModalOpen, setIsDeleteResidentModalOpen] = useState(false);
  const [ResidentToDeleteId, setResidentToDeleteId] = useState<{ id: number, buildingId: number, floorId: number, flatId: number } | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null); const [VehicleToDeleteId, setVehicleToDeleteId] = useState<{ id: number, buildingId: number, floorId: number, flatId: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [viewData, setViewData] = useState<ViewResident | null>(null);
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [viewResidentOpen, setViewResidentOpen] = useState(false);
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [loadingFlatNum, setLoadingFlatNum] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);

  const apiUrl = environment.apiUrl;
  const params = useParams();

  const societycontext = useContext(SocietyContext);
  console.log("society context:", societycontext);
  console.log("society id:", societycontext?.id);


  useEffect(() => {
    getSingleFlatResidents();
    getAllFlatVehicles();
    getFlatdetails();
  }, [user, societycontext]);

  console.log("params:", params);
  console.log("edit data in view-flat", editData);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const closeVehicleEditModal = () => {
    setIsVehicleEditModalOpen(false);
    setEditData(null);
  };


  const openDeleteModal = (Vehicle: { id: number, buildingId: number, floorId: number, flatId: number }) => {
    const selectedVehicle: ViewVehicle | undefined = VehicleList.find(
      (Vehicles) => Vehicles.id === Vehicle.id
    );

    if (selectedVehicle) {
      setVehicleDeleteData(selectedVehicle);
      setVehicleToDeleteId(Vehicle);
      console.log("VehicleToDeleteId:", VehicleToDeleteId);
      setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setVehicleToDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  //Resident Update Function
  const handleEditClick = (residentId: number) => {
    const selectedResident: ViewResident | undefined = activeFlatResidents.find(
      (resident) => resident.id === residentId
    );

    if (selectedResident) {
      setEditData(selectedResident)
      setSelectedResidentId(residentId);
      setIsEditModalOpen(true);
    }
  };

  const handleVehicleEditClick = (VehicleId: number) => {
    const selectedVehicle: ViewVehicle | undefined = VehicleList.find(
      (Vehicle) => Vehicle.id === VehicleId
    );

    if (selectedVehicle) {
      setVehicleEditData(selectedVehicle);
      // setEditDataApi(selectedVehicle);
      console.log(selectedVehicle);
      setSelectedVehicleId(VehicleId);
      console.log("Vehicle Id:", VehicleId);
      setIsVehicleEditModalOpen(true);
    }
  };

  function handleClick(VehcileId: number, isActive: boolean, flatId: number, floorId: number, buildingId: number, event: React.MouseEvent<HTMLDivElement>) {
    if (!isActive || (event.target instanceof HTMLElement && event.target.classList.contains('action-button'))) {
      return;
    }
    navigate(`/societies/${societycontext?.id}/buildings/${buildingId}/floors/${floorId}/flat/${flatId}/vehicles/${VehcileId}`);
  }

  //Table Row Select Function 
  const handleResidentClick = (residentId: number, event: React.MouseEvent<HTMLDivElement>) => {
    const selectedResident: ViewResident | undefined = activeFlatResidents.find(
      (resident) => resident.id === residentId
    );

    if (selectedResident) {
      setViewData(selectedResident)
      setSelectedResident(residentId);
    }
  };


  // Function to open the delete confirmation modal
  const openDeleteResidentModal = (resident: { id: number, buildingId: number, floorId: number, flatId: number }) => {
    const selectedResident: ViewResident | undefined = activeFlatResidents.find(
      (residents) => residents.id === resident.id
    );

    if (selectedResident) {
      setDeleteResidentData(selectedResident)
      setResidentToDeleteId(resident);
      setIsDeleteResidentModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteResidentModal = () => {
    setResidentToDeleteId(null);
    setIsDeleteResidentModalOpen(false);
  };

  //Get Current FLat Detail
  const getFlatdetails = async () => {
    try {
      setLoadingFlatNum(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const getFlatresponse = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${params.buildingId}/floors/${params.floorId}/flats/${params.id}`,
        {
          withCredentials: true,
        }).then((response) => {
          console.log("getFlatresponse:", response.data);
          setData(response.data);
          setLoadingFlatNum(false);
        });

    }
    catch (error) {
      console.log("Error in fetching Flat details:", error);
      setLoadingFlatNum(false);
    }

  }


  //Get Current Flat Residents
  const getSingleFlatResidents = async () => {
    try {
      setLoading(true);
      //  await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${params.buildingId}/floors/${params.floorId}/flats/${params.id}/residents`, {
        withCredentials: true,
      });

      const sortedResidents = response.data.content.sort((a: any, b: any) => {
        if (a.flats[0].isPrimary && !b.flats[0].isPrimary) {
          return -1;
        }
        else if (!a.flats[0].isPrimary && b.flats[0].isPrimary) {
          return 1;
        }
        else {
          return 0;
        }
      });
      setActiveFlatResidents(sortedResidents);
      console.log("Residents:", response.data.content);
      console.log("Resident-type:", response.data.content[0].flats[0].type);
      setLoading(false);
    } catch (error) {
      console.log("Error in Fetching Residents", error);
      setLoading(false);
    }
  };


  //Get Current Flat Vehicles
  const getAllFlatVehicles = async () => {
    try {
      setLoadingVehicle(true);
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/buildings/${params.buildingId}/floors/${params.floorId}/flat/${params.id}/vehicles`, {
        withCredentials: true,
      });
      console.log(response.data);
      const { content, total } = response.data;
      setVehicleList(content);
      setVehicleData(content);
      console.log("FLat Vehicle", response.data)
      console.log("FLat Vehicle", content)

      console.log("Vehicles:", response.data.content);
      setVehicleList(response.data.content);
      setLoadingVehicle(false);
    } catch (error) {
      console.log('Error in Fetching Vehicles', error);
      setLoadingVehicle(false);
    }
  };

  //add vehicle to flat
  const addVehicleToFlat = async (formData: Form
    //   {
    //   buildingId:number;
    //   floorId:number;
    //   flatId:number;
    //   number:string;
    //   name:string;
    //   type:string;
    //   isActive:boolean;
    // }
  ) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flat/${formData.flatId}/vehicles`,
        { name: formData.name, number: formData.number, type: formData.type, isActive: formData.isActive },
        {
          withCredentials: true,
        })
      if (data) {
        setIsVehicleAddModalOpen(false);
        getAllFlatVehicles();
        enqueueSnackbar("Vehicle added succesfully!", { variant: 'success' });
      } else {
        console.log("Something went wrong");
      }
      console.log("Vehicle added sucessfully", data);
    } catch (error) {
      console.log("Something went wrong in input form", error);
      enqueueSnackbar("Something went wrong!", { variant: 'error' });
    }
  }


  //Add resident to flat
  const addResidenttoFlat = async (formData: {
    name: string;
    email: string;
    phoneNumber: string;
    isChild: boolean;
    type: string;
    buildingId: number;
    floorId: number,
    flatId: number,
    isPrimary: boolean,
    isActive: boolean
  }) => {
    try {
      const { data: responseData } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flats/${formData.flatId}/residents`,
        { name: formData.name, email: formData.email, phoneNumber: formData.phoneNumber, isChild: formData.isChild, type: formData.type, isActive: formData.isActive, isPrimary: formData.isPrimary },
        {
          withCredentials: true,

        },)
      if (responseData) {
        enqueueSnackbar('Resident Added Successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getSingleFlatResidents();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form")
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }


  // Edit Resident
  const handleUpdate = async (updateData: EditForm) => {
    try {
      const response = await axios.put(
        `${apiUrl}/societies/${societycontext?.id}/buildings/${updateData.buildingId}/floors/${updateData.floorId}/flats/${updateData.flatId}/residents/${selectedResidentId}`,
        {
          name: updateData.name, email: updateData.email, phoneNumber: updateData.phoneNumber,
          isChild: updateData.isChild, type: updateData.flats[0].type, isActive: updateData.isActive, isPrimary: updateData.flats[0].isPrimary
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },

      );

      console.log(response.data);

      if (response.data) {
        console.log('Building Name Updated Successfully');
        enqueueSnackbar('Resident details updated successfully', { variant: 'success' });
        getSingleFlatResidents();
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  //Update a Vehicle

  const handleVehicleUpdate = async (formData: ViewVehicle
    //   {
    //   buildingId: number;
    //   floorId: number;
    //   flatId: number;
    //   number: string;
    //   name: string;
    //   type: string;
    //   isActive: boolean
    // }
  ) => {
    console.log("in handleupadte");
    try {
      const res = await axios.put(`${apiUrl}/societies/${societycontext?.id}/buildings/${vehicleEditData?.flats[0].flats.floor.building.id}/floors/${vehicleEditData?.flats[0].flats.floor.id}/flat/${vehicleEditData?.flats[0].flats.id}/vehicles/${selectedVehicleId}`,
        { name: formData.name, type: formData.type, isActive: formData.isActive },
        { withCredentials: true }

      );

      if (res.data) {
        console.log('Vehicle Name Updated Successfully');
        enqueueSnackbar("Vehicle updated successfully!", { variant: 'success' });
        console.log(res.data);
        console.log(res)
        getAllFlatVehicles();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
        console.log(res)
        enqueueSnackbar("Error in Vehicle updation!", { variant: 'error' });
      }
    }
    catch (error) {
      console.log('Something went wrong in Update', error);

    }
  };



  //delete a Resident

  const handleDelete = async (resident: { id: number, buildingId: number, floorId: number, flatId: number } | null) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/buildings/${resident?.buildingId}/floors/${resident?.floorId}/flats/${resident?.flatId}/residents/${resident?.id}`, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Resident DeActive successfully')
      enqueueSnackbar('Resident Deleted Successfully', { variant: 'success' });
      getSingleFlatResidents();
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Something went wrong', { variant: 'error' });
      console.log("Something went wrong")
    }
  }




  //edit ResidentofFlat


  const handleDeleteVehicle = async (Vehicle: { id: number, buildingId: number, floorId: number, flatId: number } | null) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/buildings/${Vehicle?.buildingId}/floors/${Vehicle?.floorId}/flat/${Vehicle?.flatId}/vehicles/${Vehicle?.id}`, {
        withCredentials: true,
      }
      );
      console.log("delete:", data);
      // console.log(Id)
      console.log('Vehicle DeActived successfully');
      enqueueSnackbar("Vehicle deleted successfully!", { variant: 'success' });
      getAllFlatVehicles();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong");
      enqueueSnackbar("Something went wrong", { variant: 'error' });
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

  function formatUserRole(role: string) {
    switch (role) {
      case 'OWNER':
        return 'Owner';
      case 'TENANT':
        return 'Tenant';
      case 'FAMILY_MEMBER':
        return 'Family Member';
      default:
        return role;
    }
  }

  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      to: `/society/${societycontext?.id}/flats`,
      label: 'Flats',
    },
    {
      label: `${data?.number}`
    },
  ];



  return (
    <div className={styles['container']}>

      {loadingFlatNum ? (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: "75vh" }}><CircularProgress /></div>
      ) : (<><Breadcrumbs paths={breadcrumbs} />

        <Box sx={{ marginLeft: '25px' }}>
          <h1>{data?.number}</h1>
          {/* <p>Building A, Floor 1</p> */}

          <Box id={styles['Asset-container']}>
            <Box>
              <Grid container className={styles['headerStyles']}>
                <Grid item xs={12} md={10} >
                  <Box className={styles['grid-header']}>
                    <h3 id={styles['grid_detail']}>Residents Details:</h3>
                    {/* <Box className={styles['add_btns']} >
                  
                </Box> */}
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box>
                    <AddFlatResidentComponent
                      open={isAddModalOpen}
                      onClose={() => setIsAddModalOpen(false)}
                      onSubmit={addResidenttoFlat}
                      initialData={data}
                    />
                    <ViewResidentComponent
                      open={viewResidentOpen}
                      onClose={() => setViewResidentOpen(false)}
                      residentId={selectedResident}
                      initialData={viewData}
                    />
                  </Box>
                  <Button
                    className={styles['add_btn']}
                    onClick={() => {
                      setIsAddModalOpen(true);
                    }}>
                    <AddIcon fontSize='small' />Add
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box className={styles['grid-box']}>
              {loading ? (
                <div className={styles['no-data']}><CircularProgress /></div>

              ) : (Array.isArray(activeFlatResidents) && activeFlatResidents.length > 0 ? (
                activeFlatResidents.map((response: ViewResident, index: number) => (
                  <Grid container key={index} columnGap={2.2} className={styles['grid-container']}>
                    <Grid item xs={12} md={1}><div className={styles['resident-primary']}>{response.flats[0].isPrimary === true ? (<Chip label="primary" color="primary" variant="outlined" />) : (<></>)}</div></Grid>
                    <Grid item xs={12} md={2}><div className={styles['resident-name']} onClick={(e) => { handleResidentClick(response.id, e); setViewResidentOpen(true); }}>{response.name}</div></Grid>
                    <Grid item xs={12} md={2}><div className={styles['resident-type']}>{response.flats.map((item) => (
                      <div>{formatUserRole(item.type)}</div>
                    ))}</div></Grid>
                    <Grid item xs={12} md={2}><div className={styles['resident-email']}>{response.email}</div></Grid>
                    <Grid item xs={12} md={2}> <div className={styles['resident-phone']}>+91-{response.phoneNumber}</div></Grid>
                    <Grid item xs={12} md={2}><div className={styles['resident-actions']}>

                      <IconButton classes="btn btn-primary" onClick={(e) => handleEditClick(response.id)}>
                        <EditIcon sx={{ color: 'black' }} >
                          Edit
                        </EditIcon>
                      </IconButton>
                      <IconButton classes="btn btn-danger" color="error" onClick={() => openDeleteResidentModal({ id: response.id, buildingId: response.flats[0].flat.floor.building.id, floorId: response.flats[0].flat.floor.id, flatId: response.flats[0].flat.id })}>
                        <DeleteIcon>
                          Delete
                        </DeleteIcon>
                      </IconButton>
                    </div>
                    </Grid>
                  </Grid>
                ))
              ) : (
                <div className={styles['no-data']}>No Residents found</div>
              )
              )}
            </Box>
            <EditResidentComponent
              open={isEditModalOpen}
              onClose={closeEditModal}
              onUpdate={(data) => {
                handleUpdate(data);
                closeEditModal();

              }}
              initialData={editData}
            />

            <DeleteResidentComponent
              open={isDeleteResidentModalOpen}
              onClose={closeDeleteResidentModal}
              onDelete={() => {
                handleDelete(ResidentToDeleteId);
                closeDeleteResidentModal();
              }}
              residentData={deleteResidentData}
            />
          </Box>



          <div className={styles['horizontal-line']} />


          <Box id={styles['Asset-container']}>
            <Box>
              <Grid container className={styles['headerStyles']}>
                <Grid item xs={12} md={10} >
                  <div className={styles['grid-header']}>
                    <h3 id={styles['grid_detail']}>Vehicles Details:</h3>
                  </div>
                </Grid>
                <Grid item xs={12} md={2}>
                  <AddFlatVehicleComponent
                    open={isVehicleAddModalOpen}
                    onClose={() => setIsVehicleAddModalOpen(false)}
                    onSubmit={addVehicleToFlat}
                    initialData={data}
                  />
                  <Button
                    className={styles['add_btn']}
                    onClick={() => {
                      // resetForm();
                      console.log('Add button clicked');
                      setIsVehicleAddModalOpen(true);
                    }}>
                    <AddIcon fontSize='small' />Add
                  </Button>
                </Grid>
                <EditVehicleComponent
                  open={isVehicleEditModalOpen}
                  onClose={closeVehicleEditModal}
                  onUpdate={(data) => {
                    handleVehicleUpdate(data);
                    closeVehicleEditModal();
                  }}
                  initialData={vehicleEditData} />
              </Grid>
            </Box>
            <Box className={styles['grid-box']}>
              {loadingVehicle ? (
                <div className={styles['no-data']}><CircularProgress /></div>

              ) : (Array.isArray(VehicleList) && VehicleList.length > 0 ? (
                VehicleList.map((Vehicle: ViewVehicle, index: number) => (
                  <Grid container key={index} columnGap={5} className={styles['grid-container']}>
                    <Grid item xs={12} md={2.2}><div className={`${styles['vehicle-name']} ${Vehicle.isActive ? '' : styles['inactive-vehicle']}`} onClick={(e) => handleClick(Vehicle.id, Vehicle.isActive, Vehicle.flats[0].flats.id, Vehicle.flats[0].flats.floor.id, Vehicle.flats[0].flats.floor.building.id, e)}>{Vehicle.number}</div></Grid>
                    <Grid item xs={12} md={2.2}><div className={styles['vehicle-number']}>{Vehicle.name}</div></Grid>
                    <Grid item xs={12} md={2.2}><div className={styles['vehicle-type']}> {formatVehicleType(Vehicle.type)}</div></Grid>
                    <Grid item xs={12} md={1.65}><div className={`${Vehicle.isActive ? styles.active : styles.inactive}`}>{Vehicle.isActive ? (
                      'Active'
                    ) : (
                      "InActive"
                    )}</div></Grid>
                    <Grid item xs={12} md={2}><div className={styles['vehicle-actions']}>
                      <IconButton classes="btn btn-primary" className={styles['row-action-button']} onClick={(e) => {
                        e.stopPropagation()
                        handleVehicleEditClick(Vehicle.id)
                      }}>
                        <EditIcon sx={{ color: 'black' }}>
                          Edit
                        </EditIcon>
                      </IconButton>
                      <IconButton classes="btn btn-danger" color="error" onClick={(e) => {
                        console.log("delete modal response");
                        // console.log(Vehicle);
                        // console.log({id: Vehicle.id})
                        // console.log({floorId: Vehicle.flats[0].flats.floor.id,})
                        // console.log({buildingId: Vehicle.flats[0].flats.floor.building.id, })
                        // console.log( {flatId: Vehicle.flats[0].flats.id})
                        // console.log({ id: Vehicle.id, buildingId: Vehicle.flats[0].flats.floor.building.id, floorId: Vehicle.flats[0].flats.floor.id, flatId: Vehicle.flats[0].flats.id })
                        openDeleteModal({ id: Vehicle.id, buildingId: Vehicle.flats[0].flats.floor.building.id, floorId: Vehicle.flats[0].flats.floor.id, flatId: Vehicle.flats[0].flats.id })
                      }
                      }>
                        <DeleteIcon>
                          Delete
                        </DeleteIcon>
                      </IconButton>

                    </div>
                    </Grid>
                  </Grid>
                ))
              ) : (
                <div className={styles['no-data']}>No Vehicles found</div>
              )
              )}
            </Box>
          </Box>

          <DeleteVehicleComponent
            open={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={() => {
              handleDeleteVehicle(VehicleToDeleteId);
              closeDeleteModal();
            }}
            vehicleData={vehicleDeleteData}

          />


        </Box>
      </>)}

    </div>
  );
}

export default ViewFlats;
