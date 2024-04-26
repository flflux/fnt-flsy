/* eslint-disable react/jsx-no-useless-fragment */
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { environment } from '../../../environments/environment';
import styles from './list-vehicle.module.scss';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import SearchIcon from '@mui/icons-material/Search';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Vehicle, AddVehicle, EditVehicle, ViewFlat, ViewFloor, Building, Flat } from '@fnt-flsy/data-transfer-types';
import AddVehicleComponent from './add-vehicle/add-vehicle';
import EditVehicleComponent from './edit-vehicle/edit-vehicle';
import DeleteVehicleComponent from './delete-vehicle/delete-vehicle';
import { useNavigate } from 'react-router-dom';
import { VehicleType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import { SocietyContext, UserContext } from "../../contexts/user-context";

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
  id:number;
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
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<{ id: number, buildingId: number, floorId: number, flatId: number } | null>(null);
  const [editData, setEditData] = useState<ViewVehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const user=useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { reset: resetForm } = useForm({
  });

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);


  const getAllVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/vehicles`, {
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
  }, [page, rowsPerPage, searchQueryNumber, searchQueryName, user, societycontext]);


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryNumber, searchQueryName, user]);

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

  const handleSearchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryNumber(event.target.value);
  };
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (Vehicle: { id: number, buildingId: number, floorId: number, flatId: number } | null) => {
    setVehicleToDeleteId(Vehicle);
    console.log("VehicleToDeleteId:", VehicleToDeleteId);
    setIsDeleteModalOpen(true);
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
      const res = await axios.put(`${apiUrl}/societies/${societycontext?.id}/buildings/${editData?.flats[0].flats.floor.building.id}/floors/${editData?.flats[0].flats.floor.id}/flat/${editData?.flats[0].flats.id}/vehicles/${selectedVehicleId}`,
        { name: formData.name, type: formData.type, isActive: formData.isActive },
        { withCredentials: true }

      );

      if (res.data) {
        console.log('Vehicle Name Updated Successfully');
        enqueueSnackbar("Vehicle updated successfully!",  { variant: 'success' });
        console.log(res.data);
        console.log(res)
        getAllVehicles();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
        console.log(res)
        enqueueSnackbar("Error in Vehicle updation !", { variant: 'error' });
      }
    }
    catch (error) {
      console.log('Something went wrong in Update', error);

    }
  };



  //delete a Vehicle

  const handleDelete = async (Vehicle: { id: number, buildingId: number, floorId: number, flatId: number } | null) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/${societycontext?.id}/buildings/${Vehicle?.buildingId}/floors/${Vehicle?.floorId}/flat/${Vehicle?.flatId}/vehicles/${Vehicle?.id}`, {
        withCredentials: true,
      }
      );
      console.log("delete:", data);
      // console.log(Id)
      console.log('Vehicle DeActived successfully');
      enqueueSnackbar("Vehicle Deactivated successfully!", { variant: 'success' });
      getAllVehicles();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong");
      enqueueSnackbar("Vehicle updated successfully!", { variant: 'error' });
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
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flat/${formData.flatId}/vehicles`,
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

  function handleRowClick(VehcileId: number, flatId: number, floorId: number, buildingId: number, event: React.MouseEvent<HTMLTableRowElement>) {
    if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
      return;
    }
    navigate(`/societies/${societycontext?.id}/buildings/${buildingId}/floors/${floorId}/flat/${flatId}/vehicles/${VehcileId}`);
  }


  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      label: 'Vehicles',
    },
  ];

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['Vehicle_container']}>
          <Box className={styles['btn_container']}>
            <h1 className={styles['h1_tag']}>Vehicles</h1>
            <Box>
              <AddVehicleComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addVehicle} />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                //  openAddModal();
                resetForm();
                setIsAddModalOpen(true);
              }}
            > <AddIcon fontSize='small' />Add</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "hidden" }}>Name</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Flat Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Type</TableCell>
                  <TableCell sx={{ border: "hidden" }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNameChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNumberChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNumberChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }} />
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={5}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(VehicleList) && VehicleList.length > 0 ? (
                  VehicleList.map((Vehicle: ViewVehicle, index: number) => (
                    <TableRow key={index} className={styles['table-row']} onClick={(e) => handleRowClick(Vehicle.id, Vehicle.flats[0].flats.id, Vehicle.flats[0].flats.floor.id, Vehicle.flats[0].flats.floor.building.id, e)}>
                      {/* <TableCell>{index + 1}</TableCell> */}
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
                        {Vehicle.type}
                      </TableCell>

                      <TableCell colSpan={2}>
                        <EditIcon sx={{ mr: 1 }} classes="btn btn-primary action-button" className={styles['row-action-button']} onClick={(e) => {
                          e.stopPropagation()
                          handleEditClick(Vehicle.id)
                        }}
                        >
                          Edit
                        </EditIcon>
                        <DeleteIcon sx={{ ml: 1 }} classes="btn btn-danger action-button" color="error" className={styles['row-action-button']} onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal({ id: Vehicle.id, buildingId: Vehicle.flats[0].flats.floor.building.id, floorId: Vehicle.flats[0].flats.floor.id, flatId: Vehicle.flats[0].flats.id })
                        }}>
                          Delete
                        </DeleteIcon>
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
            <TablePagination
              sx={{ marginTop: "30px" }}
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage} />
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
          }} />
      </Box>
    </>
  );
}

export default VehiclesList;
