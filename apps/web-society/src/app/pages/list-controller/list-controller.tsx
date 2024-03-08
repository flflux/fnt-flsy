import styles from './list-controller.module.scss';
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
import { useContext, useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Modal, Pagination, PaginationItem, Stack, TablePagination, TextField, } from '@mui/material';
import EditControllerComponent from './edit-controller/edit-controller';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import DeleteModal from './delete-modal/delete-modal';
// import AddController from '../add-controller/add-controller';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { environment } from '../../../environments/environment';
import { AddDevice, Device, EditDevice } from '@fnt-flsy/data-transfer-types';
import AddControllerComponent from './add-controller/add-controller';
import DeleteControllerComponent from './delete-modal/delete-modal';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { SocietyContext, UserContext } from "../../contexts/user-context";

/* eslint-disable-next-line */
export interface ListControllerProps { }

export function ListController(props: ListControllerProps) {
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
  const [editData, setEditData] = useState<EditDevice | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const user=useContext(UserContext);


  const navigate=useNavigate();
  const { reset: resetForm } = useForm({
  });

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);

  useEffect(() => {
    getAllControllers();
  }, [page, rowsPerPage, searchQueryName, searchQueryId, user, societycontext])

  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName, searchQueryId, user, societycontext]);


  const getAllControllers = async () => {
    try {
      setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/devices`, {
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

      console.log("filteredController:",filteredController);
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching Devices",error);
      setLoading(false);
    }
  };

  



  // Add Controller
  const handleAddController = async (formData: {
    name:string;
    deviceKey:string;
    type:string;
    deviceId:string;
  }) => {
    try {
      const { data } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/devices`, formData,
        {
          withCredentials: true,
        },)
      if (data) {
        setIsAddModalOpen(false);
        getAllControllers();

      } else {
        console.log("Something went wrong")
      }

    } catch (error) {
      console.log(error);
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


  const pageCountThreshold = totalItems;

  const pageCount = Math.ceil(totalItems / rowsPerPage);


  // Edit Device

  const handleUpdate = async (formData:{
    name:string;
  }) => {
    try {
      const response = await axios.put(`${apiUrl}/societies/${societycontext?.id}/devices/${selectedControllerId}`,
        {name:formData.name},
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
        enqueueSnackbar("Device updated succesfully!",{variant:'success'});
      } else {
        console.log('Device data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar("error in Device Updation",{variant:'error'});
    }
  };




  //delete Device

  // const handleDelete = async (Id: any) => {
  //   try {
  //     const { data } = await axios.put(`${apiUrl}/devices/${Id}/status`, {"isActive":false}, {
  //       withCredentials: true,
  //     });
  //     console.log(data);
  //     console.log('Flat DeActive successfully')
  //     getAllControllers();
  //   } catch (error) {
  //     console.log(error)
  //     console.log("Something went wrong")
  //   }
  // }

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

  function handleRowClick(deviceid:number, event: React.MouseEvent<HTMLTableRowElement>){
    if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
      return;
    }

    navigate(`/societies/${societycontext?.id}/devices/${deviceid}`);
  }

  const handleCheckboxChange = (buildingId: number) => {
    const isSelected = selectedItems.includes(buildingId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== buildingId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, buildingId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = activeControllers.every((Controllers) =>
      selectedItems.includes(Controllers.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allControllersIds = activeControllers.map((Controllers) => Controllers.id);
      setSelectedItems(allControllersIds);
    }
  };


  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      label: 'Devices',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
      <div className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['Device_container']}>
        <Box className={styles['btn_container']}>
          <h1>Devices</h1>
          {/* <Button variant="contained" color="primary"
            onClick={() => {
              setIsAddModalOpen(true)
            }}
          > Add New Device</Button> */}
           <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ marginTop:"17px" }}
                        onChange={handleSearchNameChange}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon color="action" />
                          ),
                        }}
                      />
                    </Box>
        </Box>
        <Box>
          
          <Box>
            {/* <AddControllerComponent
              open={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddController}
            /> */}
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    activeControllers.length > 0 &&
                    activeControllers.every((Controllers) =>
                      selectedItems.includes(Controllers.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Name</TableCell>
                  <TableCell  sx={{ border: "hidden", fontFamily: "Poppins" }}>Device ID</TableCell>
                  <TableCell  sx={{ border: "hidden", fontFamily: "Poppins" }}>Type</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
              <TableRow>
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={5}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(activeControllers) && activeControllers.length > 0 ? (
                  activeControllers.map((device: Device, index: number) => (
                    <TableRow key={index} className={styles['table-row']}  onClick={(e) => handleRowClick(device.id,e)}>
                      <TableCell><Checkbox
                      checked={selectedItems.includes(device.id)}
                      onChange={() => handleCheckboxChange(device.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                      <TableCell>
                        {device.name}
                      </TableCell>
                      <TableCell>
                        {device.id}
                      </TableCell>
                      {/* <TableCell align='center'>
                        {device.deviceKey}
                      </TableCell> */}
                      <TableCell>
                      {formatDeviceType(device?.type)}
                      </TableCell>
                      <TableCell>
                        <IconButton classes="btn btn-primary action-button"  className={styles['row-action-button']} onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(device.id)}}>
                          <EditIcon sx={{color:'black' }} >
                            Edit
                          </EditIcon>
                        </IconButton>
                        
                        {/* <DeleteIcon sx={{ ml: 1 }} classes="btn btn-danger action-button" color="error" className={styles['row-action-button']} onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(device.id)}} /> */}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{textAlign: 'center'}} colSpan={5}>No Controller found</TableCell>
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
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Box>
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


          {/* <DeleteControllerComponent
            open={isDeleteModalOpen}
            onClose={closeDeleteModal}
            onDelete={() => {
              handleDelete(ControllerToDeleteId);
              closeDeleteModal();
            }}
          /> */}
        </Box>
        </Box>
      </div>
  );
}

export default ListController;
