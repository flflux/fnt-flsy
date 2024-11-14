/* eslint-disable react/jsx-no-useless-fragment */
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { environment } from '../../../environments/environment';
import styles from './list-vehicle.module.scss';
import axios from 'axios';
import { Box, Checkbox, CircularProgress, IconButton, Pagination, PaginationItem, Stack } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import SearchIcon from '@mui/icons-material/Search';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Vehicle, AddVehicle, EditVehicle, ViewFlat, ViewFloor, Building, Flat, Society } from '@fnt-flsy/data-transfer-types';
import AddVehicleComponent from './add-vehicle/add-vehicle';
import EditVehicleComponent from './edit-vehicle/edit-vehicle';
import DeleteVehicleComponent from './delete-vehicle/delete-vehicle';
import { useNavigate, useParams } from 'react-router-dom';
import { VehicleType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext } from '../../contexts/user-contexts';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import BlockIcon from '@mui/icons-material/Block';

interface Flats {
  flats: ViewFlat
}

interface FlatVehicle {
  flats: Flats[];
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



/* eslint-disable-next-line */
export interface VehiclesListProps { }

export function VehiclesList(props: VehiclesListProps) {
  const apiUrl = environment.apiUrl;
  const [VehicleList, setVehicleList] = useState<ViewVehicle[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryNumber, setSearchQueryNumber] = useState<string>('');
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<{ id: number, isActive: boolean | undefined } | null>(null);
  const [VehicleToDeactive, setVehicleToDeactive] = useState<{  isActive: boolean | undefined }>();
  const [editData, setEditData] = useState<ViewVehicle | null>(null);
  const [vehicleDeleteData, setVehicleDeleteData] = useState<ViewVehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActive] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [society, setSociety] = useState<Society | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  console.log("society id:", id);
  const navigate = useNavigate();

  const params = useParams();
  const societyContext = useContext(SocietyContext);
  //console.log("society context:", societyContext);
  //console.log("society context society id:", societyContext?.id);
  console.log("society name:", societyContext?.name);
  console.log(params);


  const getAllVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies/${params.societyId}/vehicles`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          number: searchQueryNumber,
          name: searchQueryName,
        },
      });
      const { total, content } = response.data;
      setVehicleList(content);
      console.log(response.data);
      setTotalItems(total);
      setLoading(false);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
      setLoading(false);
    }
  };


  useEffect(() => {
    getAllVehicles();
  }, [page, rowsPerPage, searchQueryNumber, searchQueryName]);


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryNumber, searchQueryName]);

  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value);
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
    getAllVehicles();
  };

  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);

  const handleSearchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryNumber(event.target.value);
  };
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (Vehicle: { id: number, isActive: boolean | undefined } | null) => {
    const selectedVehicle: ViewVehicle | undefined = VehicleList.find(
      (Vehicles) => Vehicles.id === Vehicle?.id
    );

    if (selectedVehicle) {
    setVehicleDeleteData(selectedVehicle);
    setVehicleToDeleteId(Vehicle);
    setVehicleToDeactive({ isActive: Vehicle?.isActive });
    console.log("VehicleToDeleteId:", VehicleToDeleteId);
    setIsDeleteModalOpen(true);
    }
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setVehicleToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  // Function to close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  const handleEditClick = (VehicleId: number) => {
    const selectedVehicle: ViewVehicle | undefined = VehicleList.find(
      (Vehicle) => Vehicle.id === VehicleId
    );

    if (selectedVehicle) {
      setEditData(selectedVehicle);
      // setEditDataApi(selectedVehicle);
      console.log(selectedVehicle);
      setSelectedVehicleId(VehicleId);
      console.log("Vehicle Id:", VehicleId);
      setIsEditModalOpen(true);
    }
  };


  //Update a Vehicle

  const handleUpdate = async (formData: ViewVehicle
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
      const res = await axios.put(`${apiUrl}/societies/${params.societyId}/buildings/${editData?.flats[0].flats.floor.building.id}/floors/${editData?.flats[0].flats.floor.id}/flat/${editData?.flats[0].flats.id}/vehicles/${selectedVehicleId}`,
        { name: formData.name, type: formData.type, isActive: formData.isActive },
        { withCredentials: true }

      );

      if (res.data) {
        console.log('Vehicle Name Updated Successfully');
        enqueueSnackbar("Vehicle updated successfully!", { variant: 'success' });
        console.log(res.data);
        console.log(res)
        getAllVehicles();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
        console.log(res)
        enqueueSnackbar("Error in vehicle updation !", { variant: 'error' });
      }
    }
    catch (error) {
      console.log('Something went wrong in Update', error);
      enqueueSnackbar("Error in vehicle updation !", { variant: 'error' });
    }
  };



  //delete a Vehicle

  const handleDelete = async (Vehicle: { id: number, isActive: boolean | undefined } | null) => {
    try {
      const { data } = await axios.put(`${apiUrl}/vehicles/${Vehicle?.id}/${!Vehicle?.isActive}`, null, {
        withCredentials: true,
      }
      );
      if (Vehicle?.isActive === true) {
        console.log('Vehicle DeActive successfully');
        enqueueSnackbar("Vehicle deactivated successfully!", { variant: 'success' });
        getAllVehicles();
      } else {
        console.log('Vehicle Active successfully');
        enqueueSnackbar("Vehicle activated successfully!", { variant: 'success' });
        getAllVehicles();
      }
    }
    catch (error) {
      console.log(error)
      console.log("Something went wrong");
      enqueueSnackbar("Something went wrong", { variant: 'error' });
    }
  }

  //Add a Vehicle

  const addVehicle = async (formData: {
    buildingId: number;
    floorId: number;
    flatId: number;
    number: string;
    name: string;
    type: string;
    isActive: boolean;
  }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${params.societyId}/buildings/${formData.buildingId}/floors/${formData.floorId}/flat/${formData.flatId}/vehicles`,
        { name: formData.name, number: formData.number, type: formData.type, isActive: formData.isActive },
        {
          withCredentials: true,
        })
      if (data) {
        setIsAddModalOpen(false);
        getAllVehicles();
        enqueueSnackbar("Vehicle added succesfully!", { variant: 'success' });
      } else {
        console.log("Something went wrong");
      }
      console.log("Vehicle added sucessfully", data);
    } catch (error) {
      console.log("Something went wrong in input form", error);
      enqueueSnackbar("Something went wrong!", { variant: 'error' });
    }
  };

  function handleRowClick(VehcileId: number, isActive:boolean, flatId: number, floorId: number, buildingId: number, event: React.MouseEvent<HTMLTableRowElement>) {
    if (!isActive || (event.target instanceof HTMLElement && event.target.classList.contains('action-button'))) {
      return;
    }
    navigate(`/societies/${params.societyId}/buildings/${buildingId}/floors/${floorId}/flat/${flatId}/vehicles/${VehcileId}`);
  }

  const handleCheckboxChange = (vehicleId: number) => {
    const isSelected = selectedItems.includes(vehicleId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== vehicleId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, vehicleId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = VehicleList.every((Vechicle) =>
      selectedItems.includes(Vechicle.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allVechicleIds = VehicleList.map((Vechicle) => Vechicle.id);
      setSelectedItems(allVechicleIds);
    }
  };

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

  const breadcrumbs = [
    {
      to: '/societies',
      label: 'Societies',
    },
    {
      to: `/societies/${societyContext?.id}`,
      label: `${societyContext?.name}`
    },
    {
      label: 'Vehicles',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['Vehicle_container']}>
          <Box className={styles['btn_container']}>
            <h1>Vehicles</h1>
            <Box>
              <AddVehicleComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addVehicle} />
            </Box>
            <Box className={styles['search-container']}>
              <TextField
                type="text"
                variant="outlined"
                size="small"
                sx={{ mt: 2.3, mr: '10px' }}
                onChange={handleSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  //  openAddModal();
                  // resetForm();
                  setIsAddModalOpen(true);
                }}
              > <AddIcon fontSize='small' />Add</Button>
            </Box>

          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    VehicleList.length > 0 &&
                    VehicleList.every((Vehicle) =>
                      selectedItems.includes(Vehicle.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden" }}>Name</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Flat Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Type</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Status</TableCell>
                  <TableCell sx={{ border: "hidden" }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={7}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(VehicleList) && VehicleList.length > 0 ? (
                  VehicleList.map((Vehicle: ViewVehicle, index: number) => (
                    <TableRow key={index} className={`${styles['table-row'] } ${Vehicle.isActive ? '' : styles['inactive-vehicle']}`} onClick={(e) => handleRowClick(Vehicle.id,  Vehicle.isActive, Vehicle.flats[0].flats.id, Vehicle.flats[0].flats.floor.id, Vehicle.flats[0].flats.floor.building.id, e)}>
                      <TableCell><Checkbox
                      checked={selectedItems.includes(Vehicle.id)}
                      onChange={() => handleCheckboxChange(Vehicle.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                      <TableCell>
                        {Vehicle.name}
                      </TableCell>
                      <TableCell>
                        {Vehicle.flats[0]?.flats?.number}
                      </TableCell>
                      <TableCell>
                        {Vehicle.number}
                      </TableCell>
                      <TableCell>
                      {formatVehicleType(Vehicle.type)}
                      </TableCell>
                      <TableCell >
                        <Box className={`${styles.socname} ${Vehicle.isActive ? styles.active : styles.inactive}`}>{Vehicle.isActive ? (
                          'Active'
                        ) : (
                          "InActive"
                        )}</Box>
                      </TableCell>

                      <TableCell colSpan={2}>
                      <IconButton onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(Vehicle.id)
                        }} sx={{ color:'black'}}>
                        <EditIcon ></EditIcon>
                      </IconButton>
                        

                        {Vehicle.isActive ? (
                          <IconButton color="error" classes="btn btn-danger action-button" onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal({ id: Vehicle.id, isActive: Vehicle.isActive })
                          }}>
                             <BlockIcon>
                            Delete
                          </BlockIcon>
                          </IconButton>
                          
                        ) : (
                        <IconButton onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal({ id: Vehicle.id, isActive: Vehicle.isActive })
                        }}>
                          <RadioButtonCheckedIcon  classes="btn btn-danger action-button" className={styles['row-action-delete-button']}>
                            Delete
                          </RadioButtonCheckedIcon>
                          </IconButton>
                        )}
                        
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }} colSpan={7}>No Vehicles found</TableCell>
                  </TableRow>
                 )
                 )}
              </TableBody>
            </Table>
            <Box sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}>
          <Stack sx={{marginBottom:"15px", marginRight:"20px", marginTop: "30px",}} spacing={2}>
            <Pagination
            sx={{  display:'flex',
            flexDirection:'row',
            justifyContent:"flex-end",
           
          }}
              count={pageCount > pageCountThreshold ? pageCount + 1 : pageCount}
              page={page + 1}
              onChange={(event, value) => handleChangePage(event, value - 1)}

              renderItem={(item) => (
                <PaginationItem
                  component="div"
                  sx={{
                 
                    marginLeft: "5px",
                  
                  }}
                 
                  {...item}
                />
              )}
            />
          </Stack>
            <TablePagination
              sx={{ marginTop: "5px" }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage} />
              </Box>
          </TableContainer>

        </Box>
        <EditVehicleComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData} />

        <DeleteVehicleComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(VehicleToDeleteId);
            closeDeleteModal();
          }}
          Status={VehicleToDeactive?.isActive}
          vehicleData={vehicleDeleteData}
          />
      </Box>
    </>
  );
}

export default VehiclesList;
