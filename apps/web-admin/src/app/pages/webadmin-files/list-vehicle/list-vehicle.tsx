/* eslint-disable react/jsx-no-useless-fragment */
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { environment } from '../../../environments/environment';
import styles from './list-vehicle.module.scss';
import axios from 'axios';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import SearchIcon from '@mui/icons-material/Search';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Vehicle, AddVehicle, EditVehicle, ViewFlat, ViewFloor, Building } from '@fnt-flsy/data-transfer-types';
import AddVehicleComponent from './add-vehicle/add-vehicle';
import EditVehicleComponent from './edit-vehicle/edit-vehicle';
import DeleteVehicleComponent from './delete-vehicle/delete-vehicle';



interface ApiResponse {
  content: Vehicle[];
}




/* eslint-disable-next-line */
export interface VehiclesListProps { }

export function VehiclesList(props: VehiclesListProps) {
  const apiUrl = environment.apiUrl;
  const [VehicleList, setVehicleList] = useState<Vehicle[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryNumber, setSearchQueryNumber] = useState<string>('');
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<number | null>(null)
  const [editData, setEditData] = useState<EditVehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);


  const getAllVehicles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/vehicles`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          number: searchQueryNumber,
          name: searchQueryName
        },
      });
      console.log(response.data);
      const { content, total } = response.data;
      setVehicleList(content);
      setTotalItems(total);

      const Vehicles = response.data.content;
      const activeVehicles = Vehicles.filter(
        (Vehicle: { id: number; name: string; number: string; isActive: boolean; type: string; flatId: number }) =>
          Vehicle.isActive === true
      );

      console.log(response.data);
      setVehicleList(activeVehicles);

    } catch (error) {
      console.log(error);
      console.log('Something went wrong');
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

  const handleSearchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryNumber(event.target.value);
  };
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (VehicleId: number) => {
    setVehicleToDeleteId(VehicleId);
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
    const selectedVehicle: Vehicle | undefined = VehicleList.find(
      (Vehicle) => Vehicle.id === VehicleId
    );

    if (selectedVehicle) {
      setEditData(selectedVehicle)
      setSelectedVehicleId(VehicleId);
      console.log(VehicleId)
      setIsEditModalOpen(true);
    }
  };


  //Update a Vehicle

  const handleUpdate = async (data: EditVehicle) => {

    try {
      const res = await axios.put(`${apiUrl}/vehicles/${selectedVehicleId}`, data,
        { withCredentials: true }
      );

      if (res.data) {
        console.log('Vehicle Name Updated Successfully');
        console.log(res.data)
        getAllVehicles();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
      }
    }
    catch (error) {
      console.error(error);
      console.log('Something went wrong');

    }
  };



  //delete a Vehicle

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.put(`${apiUrl}/vehicles/${Id}/false`, null, {
        withCredentials: true,
      }
      );
      console.log("delete:", data);
      console.log(Id)
      console.log('Vehicle DeActive successfully')
      getAllVehicles();
    } catch (error) {
      console.log(error)
      console.log("Something went wrong")
    }
  }

  //Add a Vehicle

  const addVehicle = async (formData: AddVehicle) => {
    try {
      const { data } = await axios.post(`${apiUrl}/vehicles`, formData, {
        withCredentials: true,
      });
      if (data) {
        setIsAddModalOpen(false);
        getAllVehicles();
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      console.log("Something went wrong in input form");
    }
  };



  const breadcrumbs = [
    {
      to: '/home',
      label: 'Home',
    },
    {
      label: 'Vehiclelist',
    },
  ];

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['Vehicle_container']}>
          <Box className={styles['btn_container']}>
            <h1>Vehicle List</h1>
            <Box>
              <AddVehicleComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addVehicle}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                //  openAddModal()
                // resetForm();
                setIsAddModalOpen(true)
              }}
            > Add New Vehicle</Button>
          </Box >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ border: "hidden" }}>Name
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}>Number
                  </TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}>Type</TableCell>
                  <TableCell align='center' sx={{ border: "hidden" }}></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align='center'>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="standard"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNameChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="standard"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNumberChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" sx={{ ml: "10px" }} />
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(VehicleList) && VehicleList.length > 0 ? (
                  VehicleList.map((Vehicle: Vehicle, index: number) => (
                    <TableRow key={index}>
                      {/* <TableCell>{index + 1}</TableCell> */}
                      <TableCell align='center'>
                        {Vehicle.name}
                      </TableCell>
                      <TableCell align='center'>
                        {Vehicle.number}
                      </TableCell>
                      <TableCell align='center'>
                        {Vehicle.type}
                      </TableCell>

                      <TableCell align='center' colSpan={2}>
                        <EditIcon sx={{ mr: 1 }} className="btn btn-primary" onClick={() =>
                          handleEditClick(Vehicle.id)
                        }>
                          Edit
                        </EditIcon>
                        <DeleteIcon sx={{ ml: 1 }} className="btn btn-danger" color="error" onClick={() =>
                          openDeleteModal(Vehicle.id)
                        }>
                          Delete
                        </DeleteIcon>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={5}>No Vehicles found</TableCell>
                  </TableRow>
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
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>

        </Box>
        <EditVehicleComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeleteVehicleComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(VehicleToDeleteId);
            closeDeleteModal();
          }}
        />
      </Box >
    </>
  );
}

export default VehiclesList;
