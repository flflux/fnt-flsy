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
import { useEffect, useState } from 'react';
import { Box, Button, Modal, TablePagination, TextField, } from '@mui/material';
import EditControllerComponent from './edit-controller/edit-controller';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import DeleteModal from './delete-modal/delete-modal';
// import AddController from '../add-controller/add-controller';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { environment } from '../../../environments/environment';
import { AddDevice, Device, EditDevice } from '@fnt-flsy/data-transfer-types';
import AddControllerComponent from './add-controller/add-controller';
import DeleteControllerComponent from './delete-modal/delete-modal';
/* eslint-disable-next-line */
export interface ListControllerProps { }

export function ListController(props: ListControllerProps) {
  const [data, setData] = useState([]);
  const [devices, setDevices]=useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const apiUrl = environment.apiUrl;

  const [searchQueryId, setSearchQueryId] = useState<string>('');
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [activeControllers, setActiveControllers] = useState<Device[]>([]);

  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [ControllerToDeleteId, setControllerToDeleteId] = useState<number | null>(null);
  // const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditDevice | null>(null);
  const [selectedControllerId, setSelectedControllerId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);



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
      setActiveControllers(filteredController);

      console.log(filteredController)

    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
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



  // Add Building
  const handleAddController = async (formData: AddDevice) => {
    try {
      const { data } = await axios.post(`${apiUrl}/devices`, formData,
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

  // Function to close the delete confirmation modal
  // const closeDeleteModal = () => {
  //   setControllerToDeleteId(null);
  //   setIsDeleteModalOpen(false);
  // };

  // Edit Model for Separate component

  // const closeEditModal = () => {
  //   setIsEditModalOpen(false);
  //   setEditData(null);
  // };


  //Building Update OpenModal for separate component

  // const handleEditClick = (ControllerId: number) => {
  //   const selectedController: Device | undefined = activeControllers.find(
  //     (Device) => Device.id === ControllerId
  //   );

  //   if (selectedController) {
  //     setEditData(selectedController)
  //     setSelectedControllerId(ControllerId);
  //     console.log(ControllerId)
  //     setIsEditModalOpen(true);
  //   }
  // };


  // const openEditDialog = (rowData:any) => {
  //   console.log('inside the openedit dialog box function data: ',rowData);
  //   setSelectedRowData(rowData);
  //   setIsEditDialogOpen(true);
  // };

  // // Function to close the edit dialog
  // const closeEditDialog = () => {
  //   setIsEditDialogOpen(false);
  //   setSelectedRowData(null);
  // };

  // const handleEditSave = (editedData:any) => {
  //   // Handle saving edited data here (e.g., make an API call)
  //   console.log('Edited Data:', editedData);

  //   // Close the edit dialog
  //   closeEditDialog();
  // };


  // // Function to open the delete confirmation modal
  // const openDeleteModal = (id: number) => {
  //   setControllerToDeleteId(id);
  //   setIsDeleteModalOpen(true);
  // };

  // // Function to close the delete confirmation modal
  // const closeDeleteModal = () => {
  //   setControllerToDeleteId(0);
  //   setIsDeleteModalOpen(false);
  // };



  // const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQueryName(event.target.value);
  //   getAllControllers();
  // };



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



  // Edit Flat

  const handleUpdate = async (data: EditDevice) => {
    try {
      const response = await axios.put(
        `${apiUrl}/devices/${selectedControllerId}`,
        data,
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
        // navigate(`/buildinglist/${params.id}`);
        getAllControllers();
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
    }
  };




  //delete a Device

  const handleDelete = async (Id: any) => {
    try {
      const { data } = await axios.put(`${apiUrl}/devices/${Id}/status`, {
        "isActive": false
      }, {
        withCredentials: true,
      });
      console.log(data);
      console.log('Device DeActive successfully')
      getAllControllers();
    } catch (error) {
      console.log(error)
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


  // const handleEdit = (id: number) => {
  //   const rowData = data.find((row) => row.id === id);
  //   if (rowData) {
  //     setEditData({ ...rowData });
  //     setEditOpen(true);
  //   }
  // };

  // const handleSave = (editedData: any) => {
  //   const updatedData = data.map((row) =>
  //     row.id === editedData.id ? editedData : row
  //   );
  //   setData(updatedData);
  // };


  // useEffect(() => {
  //   getAllVehicles();
  //   getAllBuildings();
  //   getAllFloors();
  //   getAllFlats();
  // }, [page, rowsPerPage, totalbuildingValue, totalFlatValue, totalValue, searchQueryNumber, searchQueryName]);



  // const handleChangePage = (event: any, newPage: number) => {
  //   console.log('Page changed to:', newPage);
  //   setPage(newPage);
  // };


  // const handleChangeRowsPerPage = (event: any) => {
  //   const newRowsPerPage = parseInt(event.target.value, VehicleList.length);
  //   console.log('Rows per page changed to:', newRowsPerPage);
  //   setRowsPerPage(newRowsPerPage);
  //   setPage(0);
  //   setRowsPerPage(newRowsPerPage);
  //   getAllVehicles();
  // };



  const handleSearchIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryId(event.target.value);
  };
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
  };


  const handlegetDevices=async()=>{
    const response=await axios.get(`${apiUrl}/devices`,{
      withCredentials:true,
    }).then((response)=>{
      console.log("controllers list:",response.data);
      console.log("controllers list content:",response.data.content);
      setData(response.data.content);
    });
  }

  useEffect(()=>{
    handlegetDevices();
 },[]);
  const handleEditClick = (DeviceId: number) => {
    const selectedController: Device | undefined = activeControllers.find(
      (Device) => Device.id === DeviceId
    );
    console.log("I am here")
    if (selectedController) {
      // setEditData(selectedController);
      setSelectedControllerId(DeviceId);
      setIsEditModalOpen(true);
    }
  };



  const breadcrumbs = [
    {
      to: '/home',
      label: 'Home',
    },
    {
      label: 'Controller',
    },
  ];


  return (
    <div className={styles['container']}>
      <Breadcrumbs paths={breadcrumbs} />
      <Box className={styles['btn_container']}>
        <h1>Controllers</h1>
        <Button variant="contained" color="primary"
          onClick={() => {
            setIsAddModalOpen(true)
          }}
        > Add New Controller</Button>
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
                <TableCell>Name</TableCell>
                <TableCell>Controller_id</TableCell>
                <TableCell>Type</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
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
                          <SearchIcon color="action" sx={{ textAlign: "inherit" }} />
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
                      onChange={handleSearchIdChange}
                      InputProps={{
                        startAdornment: (
                          <SearchIcon color="action" sx={{ textAlign: "inherit" }} />
                        ),
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.isArray(activeControllers) && activeControllers.length > 0 ? (
                activeControllers.map((device: Device, index: number) => (
                  <TableRow key={index}>
                    <TableCell >
                      <Link to={`/device/${device.id}`} className={styles['controllername']} style={{textDecoration:"none",color:"black"}}>{device.name}</Link>

                    </TableCell>
                    <TableCell>
                      {device.deviceId}
                    </TableCell>
                    <TableCell>
                      {device.deviceKey}

                    </TableCell>
                    <TableCell>
                      {device.type}

                    </TableCell>

                    <TableCell>
                      <EditIcon sx={{ mr: 1 }} className="btn btn-primary" onClick={() => handleEditClick(device.id)}>
                        Edit
                      </EditIcon>
                      <DeleteIcon sx={{ ml: 1 }} onClick={() => openDeleteModal(device.id)} className="btn btn-danger" color="error" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align='center' colSpan={5}>No Controller found</TableCell>
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

        {/* Edit dialog */}
        {/* <Modal open={isEditDialogOpen} onClose={closeEditDialog}>
            <Box className={styles['modal-container']}>
               <h2>Edit Controllers</h2>
              <EditController open={isEditDialogOpen} onClose={closeEditDialog} rowData={selectedRowData} onSave={handleEditSave} />
              </Box>
          </Modal> */}


        {/* Delete Controller */}
        {/* <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
          <Box className={styles['modal-container']}>
            <DeleteModal onClose={closeDeleteModal} deleteId={ControllerToDeleteId}/>
          </Box>
        </Modal> */}

        <DeleteControllerComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(ControllerToDeleteId);
            closeDeleteModal();
          }}
        />
      </Box>
    </div>
  );
}

export default ListController;
