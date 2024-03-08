import styles from './list-all-controller.module.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { Box, Button, Modal, TablePagination, TextField, } from '@mui/material';
import EditControllerComponent from '../list-controller/edit-controller/edit-controller';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
// import DeleteModal from '../list-controller/delete-modal/delete-modal';
// import AddController from '../add-controller/add-controller';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { environment } from '../../../environments/environment';
import { AddDevice, Device, EditDevice, Society } from '@fnt-flsy/data-transfer-types';
import AddControllerComponent from '../list-controller/add-controller/add-controller';
import DeleteControllerComponent from '../list-controller/delete-modal/delete-modal';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';


interface Form {
  name: string;
  deviceId: string;
  type: string;
  thingId: string;
  thingKey: string,
  channelId: string,
}

/* eslint-disable-next-line */
export interface ListAllControllerProps { }

export function ListAllController(props: ListAllControllerProps) {
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const apiUrl = environment.apiUrl;
  const [searchQueryId, setSearchQueryId] = useState<string>('');
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [activeControllers, setActiveControllers] = useState<Device[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [ControllerToDeleteId, setControllerToDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Form | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [society, setSociety] = useState<Society | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { reset: resetForm } = useForm({
  });

  const { id } = useParams<{ id: string }>();
  console.log("society id:", id);

  useEffect(() => {
    getSociety();
  }, [])

  const getSociety = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${id}`, {
        withCredentials: true
      });
      console.log("Current society:", response.data);
      setSociety(response.data);
    } catch (error) {
      console.log("Error in fetching society list", error);
    }
    console.log(society?.name);
  }


  const getAllControllers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/devices`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
          id: searchQueryId
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveControllers(content);

      const controller = response.data.content;
      const filteredController = controller.filter(
        (flat: { id: number; number: string; isActive: boolean; floor: { id: any; number: string; building: { id: any; name: string } } }) =>
          flat.isActive === true
      );
      setActiveControllers(controller);

      console.log("filteredController:", filteredController);

    } catch (error) {
      console.log("Error in fetching Devices", error);
    }
  };

  useEffect(() => {
    getAllControllers();
  }, [page, rowsPerPage, searchQueryName])

  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName, searchQueryId]);



  // Add Controller
  const handleAddController = async (formData: {
    name: string;
    deviceKey: string;
    type: string;
    deviceId: string;
  }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/1/devices`, formData,
        {
          withCredentials: true,
        },)
      if (data) {
        setIsAddModalOpen(false);
        getAllControllers();
        enqueueSnackbar("Controller added successfully!", { variant: 'success' });
      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
      enqueueSnackbar("Something went wrong", { variant: 'error' });
      console.log("Something went wrong in input form")

    }
  }


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


  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };



  // Edit Device

  const handleUpdate = async (formData: Form) => {
    try {
      const response = await axios.put(`${apiUrl}/societies/1/devices/${selectedControllerId}/settings`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        },
      );
      console.log(response.data);

      if (response.data) {
        console.log('Device Name Updated Successfully');
        // navigate(`/buildinglist/${params.id}`);
        getAllControllers();
        enqueueSnackbar("Controller updated successfully!", { variant: 'success' });
      } else {
        console.log('Device data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar("error in Device Updation", { variant: 'error' });
    }
  };




  //delete Device

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.delete(`${apiUrl}/societies/1/devices/${Id}`, {
        withCredentials: true,
      });
      console.log(data);
      enqueueSnackbar("Controller deleted successfully!", { variant: 'success' });
      console.log('Flat deleted successfully')
      getAllControllers();
    } catch (error) {
      console.log(error)
      enqueueSnackbar("Something went wrong", { variant: 'error' });
      console.log("Something went wrong")
    }
  }

  //add
  const openAddModal = () => {
    setIsAddModalOpen(true);
  }
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  }


  const handleSearchIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryId(event.target.value);
  };
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
  };


  const handleEditClick = (DeviceId: number) => {
    const selectedController: Device | undefined = activeControllers.find(
      (Device) => Device.id === DeviceId
    );
    console.log("I am here")
    if (selectedController) {
      setEditData(selectedController);
      setSelectedControllerId(DeviceId);
      setIsEditModalOpen(true);
    }
  };

  function handleRowClick(deviceid: number, event: React.MouseEvent<HTMLTableRowElement>) {
    if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
      return;
    }

    navigate(`/societies/1/devices/${deviceid}`);
  }


  const breadcrumbs = [
    {
      to: '/societies',
      label: 'Societies',
    },
    {
      label: 'Controllers',
    },
  ];


  return (
    <div className={styles['container']}>
      <Breadcrumbs paths={breadcrumbs} />
      <Box className={styles['Device_container']}>
        <Box className={styles['btn_container']}>
          <h1>Controllers</h1>
          <Button variant="contained" color="primary"
            onClick={() => {
              setIsAddModalOpen(true)
            }}
          ><AddIcon fontSize='small' />Add</Button>
        </Box>
        <Box>
          <Box>
            <AddControllerComponent
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddController}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Name</TableCell>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Controller_id</TableCell>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Type</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell >
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchNameChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" />
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchIdChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" />
                          ),
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {Array.isArray(activeControllers) && activeControllers.length > 0 ? (
                  activeControllers.map((device: Device, index: number) => (
                    <TableRow key={index} className={styles['table-row']} onClick={(e) => handleRowClick(device.id, e)}>
                      <TableCell>
                        {device.name}
                      </TableCell>
                      <TableCell>
                        {device.deviceId}
                      </TableCell>
                      {/* <TableCell align='center'>
                        {device.deviceKey}
                      </TableCell> */}
                      <TableCell>
                        {device.type}
                      </TableCell>
                      <TableCell>
                        <EditIcon sx={{ mr: 1 }} classes="btn btn-primary action-button" className={styles['row-action-button']} onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(device.id)
                        }}>
                          Edit
                        </EditIcon>
                        <DeleteIcon sx={{ ml: 1 }} classes="btn btn-danger action-button" color="error" className={styles['row-action-button']} onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(device.id)
                        }} />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{ textAlign: 'center' }} colSpan={5}>No Controller found</TableCell>
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
          <EditControllerComponent
            open={isEditModalOpen}
            onClose={closeEditModal}
            onUpdate={(data) => {
              handleUpdate(data);
              closeEditModal();
            }}
            initialData={editData}
          />


          <DeleteControllerComponent
            open={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={() => {
              handleDelete(ControllerToDeleteId);
              closeDeleteModal();
            }}
          />
        </Box>
      </Box>
    </div>
  );
}

export default ListAllController;
