import axios from 'axios';
import styles from './list-fl-user.module.scss';
import { environment } from '../../../environments/environment';
import { useCallback, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Autocomplete, TextField, Button, Modal, InputLabel, Checkbox, Box, CircularProgress, IconButton, Icon, Stack, Pagination, PaginationItem } from '@mui/material';
import Breadcrumbs from '../../Components/bread-crumbs/bread-crumbs';
import AddFLAdmin from './add-fl-admin/add-fl-admin';
import { enqueueSnackbar } from 'notistack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import EditFLAdmin from './edit-fl-admin/edit-fl-admin';
import DeleteFLAdmin from './delete-fl-admin/delete-fl-admin';
import ViewFLUserComponent from './view-fl-admin/view-fl-admin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import BlockIcon from '@mui/icons-material/Block';
import Loading from '../../Components/loading/loading';

interface FLUser {
  id:number;
  superRole:string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  isActive:boolean;
  }


interface AddFLuser {
  superRole:string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

/* eslint-disable-next-line */
export interface ListFLUserProps {}

export function ListFLUser(props: ListFLUserProps) {
  const apiUrl = environment.apiUrl;
  const [flUserData, setFLUserData] = useState<FLUser[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFLUserId, setSelectedFLUserId] = useState<number | null>(null);
  const [editData, setEditData] = useState<FLUser | null>(null);
  const [deleteData, setDeleteData] = useState<FLUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<{ id: number, isActive: boolean | undefined } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flUserToDeactive, setFlUserToDeActive] = useState<{  isActive: boolean | undefined }>();
  const [viewFlUserOpen, setViewFlUserOpen] = useState(false);
  const [viewData, setViewData] = useState<FLUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

  const getAllFLUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/admins`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
        },
      });
      // console.log(response.data[0].user)
      const {content, total} = response.data;
      setFLUserData(response.data.content);
      setTotalItems(total)
      console.log("Admin Data",response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching society data:', error);
      setLoading(false);
    }
  }, [apiUrl, setFLUserData, searchQueryName]);
  
useEffect(() => {
 
  getAllFLUsers();
}, [apiUrl, getAllFLUsers, searchQueryName]);
  

const addFLUser = async (formData: AddFLuser) => {
  try {
     await setIsAddModalOpen(false);
    setIsLoadingModalOpen(true);
    const { data } = await axios.post(`${apiUrl}/admins`,
      formData,
      {
        withCredentials: true,
      })
    if (data) {
      getAllFLUsers();
      // setIsAddModalOpen(false);
      setIsLoadingModalOpen(false);
      enqueueSnackbar("User added successfully!", { variant: 'success' });
    } else {
      console.log("Something went wrong");
      setIsLoadingModalOpen(false);
    }
    console.log("User added successfully", data);
  } catch (error) {
    console.log("Something went wrong in input form", error);
    enqueueSnackbar("Something went wrong!", { variant: 'error' });
    setIsLoadingModalOpen(false);
  }
};

const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQueryName(event.target.value);
  getAllFLUsers();
};

const handleCheckboxChange = (UserId: number) => {
  const isSelected = selectedItems.includes(UserId);
  if (isSelected) {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((id) => id !== UserId)
    );
  } else {
    setSelectedItems((prevSelected) => [...prevSelected, UserId]);
  }
};

const handleHeaderCheckboxChange = () => {
  const allSelected = flUserData.every((user) =>
    selectedItems.includes(user.id)
  );

  if (allSelected) {
    setSelectedItems([]);
  } else {
    const allUserIds = flUserData.map((user) => user.id);
    setSelectedItems(allUserIds);
  }
};


 //Table Row Select Function
 const handleRowClick = (FLUserId: number, event: React.MouseEvent<HTMLTableRowElement>) => {
  const selectedFlUser: FLUser | undefined = flUserData.find(
    (user) => user.id === FLUserId
  );

  if (selectedFlUser) {
    setViewData(selectedFlUser)
    getAllFLUsers();
    setSelectedFLUserId(FLUserId);
  }
};

 //FLUser Update OpenModal
 const handleEditClick = (FLUserId: number) => {
  const selectedFLUser: FLUser | undefined = flUserData.find(
    (User) => User.id === FLUserId
  );

  if (selectedFLUser) {
    setEditData(selectedFLUser)
    setSelectedFLUserId(FLUserId);
    console.log(FLUserId)
    setIsEditModalOpen(true);
  }
};

const openDeleteModal = (user: { id: number, isActive: boolean | undefined } | null) => {
  const selectedUser: FLUser | undefined = flUserData.find(
    (Users) => Users.id === user?.id
  );

  if (selectedUser) {
  setDeleteData(selectedUser);
  setUserToDeleteId(user);
  setFlUserToDeActive({ isActive: user?.isActive });
  console.log("flatToDeleteId:", userToDeleteId);
  setIsDeleteModalOpen(true);
  }
};

// Function to close the delete confirmation modal
const closeDeleteModal = () => {
  setUserToDeleteId(null);
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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


 // Edit FL User
 const handleUpdate = async (formData: AddFLuser) => {
  try {
    console.log(editData);
    const response = await axios.put(
      `${apiUrl}/admins/${selectedFLUserId}`,
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
      console.log('Building Name Updated Successfully');
      enqueueSnackbar("User updated successfully!", { variant: 'success' });
      // navigate(`/buildinglist/${params.id}`);
      getAllFLUsers();
      setIsModalOpen(false)
    } else {
      console.log('Update data not received');
      enqueueSnackbar("Error in Updation !", { variant: 'error' });
    }

  } catch (error) {
    console.error(error);
    console.log('Something went wrong');
    enqueueSnackbar("Something went wrong", { variant: 'error' });
  }
};


  //delete a FL User

  const handleDelete = async (user: { id: number, isActive: boolean | undefined } | null) => {
    try {
      setIsLoadingModalOpen(true);
      const { data } = await axios.put(`${apiUrl}/users/${user?.id}/status`, {isActive: !user?.isActive},{
        withCredentials: true,
      });
      console.log(data);
      console.log('Flat DeActive successfully');
      setIsLoadingModalOpen(false);
      enqueueSnackbar(`User ${flUserToDeactive?.isActive===false ? 'activated': 'deactivated'} successfully!`, { variant: 'success' });
      getAllFLUsers();
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
      setIsLoadingModalOpen(false);
      enqueueSnackbar("Error in Deletion!", { variant: 'error' });
    }
  }

  function formatSuperRoleType(type: string) {
    switch (type) {
        case 'ADMIN':
            return 'Admin';
        case 'USER':
            return 'User';
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
    label: 'Users',
  },
];

  return (
    <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>
          <Box className={styles['btn_container']}>
            <h1>Users</h1>
            <Box>
              <AddFLAdmin
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={addFLUser}
              />
                <Loading open={isLoadingModalOpen}
                    onClose={() => setIsLoadingModalOpen(false)} />
            </Box>
            <Box className={styles['search-container']}>
              <TextField
                sx={{ mt: 2.3, mr: '10px' }}
                type="text"
                variant="outlined"
                size="small"
                onChange={handleSearchNameChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" />
                  ),
                }}
              />
              <Button variant="contained" color="primary"
                onClick={() => {
                  setIsAddModalOpen(true);
                }}
              > <AddIcon fontSize='small' />Add</Button>
            </Box>

          </Box >
          <TableContainer className={styles['table_container']}>
            <Table stickyHeader>
              <TableHead className={styles['table_head']}>
              <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    flUserData.length > 0 &&
                    flUserData.every((user) =>
                      selectedItems.includes(user.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden" }}>Name
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Email
                  </TableCell>
                  <TableCell sx={{ border: "hidden", fontFamily: "Poppins" }}>Role
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Status</TableCell>
                  <TableCell sx={{ border: "hidden" }}></TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                <TableRow
                //    sx={{
                //   position:"sticky",
                //   top: 56,
                //   backgroundColor:"white",
                // }}
                >
                </TableRow>
                {loading ? (
                <TableCell align='center' colSpan={6}>
                  <CircularProgress />
                </TableCell>
              ) : (Array.isArray(flUserData) && flUserData.length > 0 ? (
                  flUserData.map((flUser: FLUser) => (
                    <TableRow className={styles['table-row']} onClick={(e) => {handleRowClick(flUser.id, e); setViewFlUserOpen(true); }}>
                      <TableCell><Checkbox
                      checked={selectedItems.includes(flUser.id)}
                      onChange={() => handleCheckboxChange(flUser.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                    </TableCell >
                    <TableCell >
                        {flUser.firstName} {flUser.lastName}
                      </TableCell>
                      <TableCell>
                        {flUser.email}
                      </TableCell>
                      <TableCell>
                      {formatSuperRoleType(flUser.superRole)}
                      </TableCell>
                      <TableCell >
                        <Box className={`${styles.socname} ${flUser?.isActive ? styles.active : styles.inactive}`}>{flUser?.isActive ? (
                          'Active'
                        ) : (
                          "InActive"
                        )}</Box>
                      </TableCell>
                      <TableCell >
                        <IconButton classes="btn btn-primary action-button" sx={{color:'black'}} onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(flUser.id);
                        }}>
                        <EditIcon >
                          Edit
                        </EditIcon>
                        </IconButton>
                        
                        {/* <DeleteIcon sx={{ ml: 1 }} classes="btn btn-danger action-button" color="error" className={styles['row-action-button']} onClick={(e) => {
                          // handleDelete(building.id)
                          e.stopPropagation();
                          openDeleteModal({ id: flUser.id, isActive: flUser.isActive })
                        }}>
                          Delete
                        </DeleteIcon> */}
                         {flUser.isActive ? (
                          <IconButton classes="btn btn-danger action-button" color="error"  onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal({ id: flUser.id, isActive: flUser.isActive })
                          }}>
                            <BlockIcon>
                              Delete
                            </BlockIcon>
                          </IconButton>
                          
                        ) : (
                          <IconButton classes="btn btn-danger action-button"   onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal({ id: flUser.id, isActive: flUser.isActive })
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
                    <TableCell align='center' colSpan={7}>No User found</TableCell>
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
              className={styles['pagination']}
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

        </Box >
         
        <ViewFLUserComponent
                open={viewFlUserOpen}
                onClose={() => setViewFlUserOpen(false)}
                initialData={viewData}
              />

        <EditFLAdmin
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        <DeleteFLAdmin
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(userToDeleteId);
            closeDeleteModal();
          }}
          Status={flUserToDeactive?.isActive}
          userData={deleteData}
        />
      </Box >
  );
}

export default ListFLUser;
