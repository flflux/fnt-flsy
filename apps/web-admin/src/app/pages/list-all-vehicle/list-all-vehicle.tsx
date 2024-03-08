import { Box, Button, Checkbox, IconButton, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Stack, Pagination, PaginationItem } from '@mui/material';
import styles from './list-all-vehicle.module.scss';
import AddVehicleComponent from '../list-vehicle/add-vehicle/add-vehicle';
import { environment } from '../../../environments/environment';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import EditVehicleComponent from '../list-vehicle/edit-vehicle/edit-vehicle';
import DeleteVehicleComponent from '../list-vehicle/delete-vehicle/delete-vehicle';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
/* eslint-disable-next-line */
export interface ListAllVehicleProps { }

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



export function ListAllVehicle(props: ListAllVehicleProps) {
  const apiUrl = environment.apiUrl;
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [VehicleList, setVehicleList] = useState<ViewVehicle[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [VehicleToDeleteId, setVehicleToDeleteId] = useState<{ id: number, isActive: boolean | undefined } | null>(null);
  const [VehicleToDeactive, setVehicleToDeactive] = useState<{ isActive: boolean | undefined }>();
  const [loading, setLoading] = useState(true);
  const [vehicleDeleteData, setVehicleDeleteData] = useState<ViewVehicle | null>(null);

  useEffect(() => {
    getAllVehicles();
  }, [page, rowsPerPage]);


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQuery]);

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

  const getAllVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/vehicles`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          number: searchQuery,
          name: searchQuery,
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

  const handleDelete = async (Vehicle: { id: number, isActive: boolean | undefined } | null) => {
    try {
      const { data } = await axios.put(`${apiUrl}/vehicles/${Vehicle?.id}/${!Vehicle?.isActive}`, null, {
        withCredentials: true,
      }
      );
      if (Vehicle?.isActive === true) {
        console.log('Vehicle DeActive successfully');
        enqueueSnackbar("Vehicle Deactivated successfully!", { variant: 'success' });
        getAllVehicles();
      } else {
        console.log('Vehicle Active successfully');
        enqueueSnackbar("Vehicle Activated successfully!", { variant: 'success' });
        getAllVehicles();
      }
    }
    catch (error) {
      console.log(error)
      console.log("Something went wrong");
      enqueueSnackbar("Something went wrong", { variant: 'error' });
    }
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

  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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

  function handleRowClick(VehcileId: number, flatId: number, floorId: number, buildingId: number, societyId: number, isActive: boolean, event: React.MouseEvent<HTMLTableRowElement>) {
    if (!isActive || (event.target instanceof HTMLElement && event.target.classList.contains('action-button'))) {
      return;
    }
    console.log(VehcileId, flatId, floorId, buildingId);
    navigate(`/societies/${societyId}/buildings/${buildingId}/floors/${floorId}/flat/${flatId}/vehicles/${VehcileId}`);
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

  const breadcrumbs = [
    {
      to: '/societies',
      label: 'Societies',
    },
    {
      label: 'Vehicles',
    },
  ];


  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <Box className={styles['container']}>
      <Breadcrumbs paths={breadcrumbs} />
      <Box className={styles['Vehicle_container']}>
        <Box className={styles['btn_container']}>
          <h1>Vehicles</h1>
          <Box>
            {/* <AddVehicleComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addVehicle} /> */}
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
            {/* <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  //  openAddModal();
                  // resetForm();
                  setIsAddModalOpen(true);
                }}
              > <AddIcon fontSize='small' />Add</Button> */}
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
                <TableCell sx={{ border: "hidden" }}>Number</TableCell>
                <TableCell sx={{ border: "hidden" }}>Name</TableCell>
                <TableCell sx={{ border: "hidden" }}>Type</TableCell>
                <TableCell sx={{ border: "hidden" }}>Society, Flat</TableCell>
                <TableCell sx={{ border: "hidden" }}>Status</TableCell>
                <TableCell sx={{ border: "hidden" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
              </TableRow>
              {loading ? (
                <TableCell align='center' colSpan={8}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(VehicleList) && VehicleList.length > 0 ? (
                VehicleList.map((Vehicle: ViewVehicle, index: number) => (
                  <TableRow key={index} className={`${styles['table-row']} ${Vehicle.isActive ? '' : styles['inactive-vehicle']}`} onClick={(e) => handleRowClick(Vehicle.id, Vehicle.flats[0].flats.id, Vehicle.flats[0].flats.floor.id, Vehicle.flats[0].flats.floor.building.id, Vehicle.flats[0].flats.floor.building.society.id, Vehicle.isActive, e)}>
                    {/* <TableCell>{index + 1}</TableCell> */}
                    <TableCell><Checkbox
                      checked={selectedItems.includes(Vehicle.id)}
                      onChange={() => handleCheckboxChange(Vehicle.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                    <TableCell>
                      {Vehicle.number}
                    </TableCell>
                    <TableCell>
                      {Vehicle.name}
                    </TableCell>
                    <TableCell>
                      {formatVehicleType(Vehicle.type)}
                    </TableCell>
                    <TableCell>
                      {Vehicle.flats[0]?.flats?.floor?.building?.society?.name}, {Vehicle.flats[0]?.flats?.floor?.building?.name}, {Vehicle.flats[0]?.flats?.number}
                    </TableCell>
                    <TableCell >
                      <Box className={`${styles.socname} ${Vehicle.isActive ? styles.active : styles.inactive}`}>{Vehicle.isActive ? (
                        'Active'
                      ) : (
                        "InActive"
                      )}</Box>
                    </TableCell>

                    <TableCell colSpan={2}>
                      {/* <EditIcon sx={{ mr: 1 }} classes="btn btn-primary action-button" className={styles['row-action-button']} onClick={(e) => {
                          e.stopPropagation()
                          // handleEditClick(Vehicle.id)
                        }}
                        >
                          Edit
                        </EditIcon> */}

                      {Vehicle.isActive ? (
                        <IconButton classes="btn btn-danger action-button" color="error" onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal({ id: Vehicle.id, isActive: Vehicle.isActive })
                        }}>
                          <BlockIcon>
                            Delete
                          </BlockIcon>
                        </IconButton>

                      ) : (
                        <IconButton classes="btn btn-danger action-button" onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal({ id: Vehicle.id, isActive: Vehicle.isActive })
                        }}>
                          <RadioButtonCheckedIcon className={styles['row-action-delete-button']}>
                            Delete
                          </RadioButtonCheckedIcon>
                        </IconButton>
                      )}
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
      {/* <EditVehicleComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData} /> */}

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
  );
}

export default ListAllVehicle;
