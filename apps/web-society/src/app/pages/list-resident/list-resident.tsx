/* eslint-disable react/jsx-no-useless-fragment */
import styles from './list-resident.module.scss';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Button, Checkbox } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import Breadcrumbs from '../../Component/bread-crumbs/bread-crumbs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddResidentComponent from './add-resident/add-resident';
import EditResidentComponent from './edit-resident/edit-resident';
import DeleteResidentComponent from './delete-resident/delete-resident';
import ViewResidentComponent from '../view-resident/view-resident';
import { enqueueSnackbar } from 'notistack';
import { SocietyContext, UserContext } from "../../contexts/user-context";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
/* eslint-disable-next-line */
export interface ListResidentsProps { }


interface Form {
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  type: string;
  buildingId: number;
  floorId: number,
  flatId: number,
  isActive: boolean
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
      isPrimary: boolean;
      type: string;

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

export interface EditForm {
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  buildingId: number;
  floorId: number,
  flatId: number,
  isActive: boolean
  flats: [
    {
      isPrimary:boolean;
      type: string;

      flat: {

        number: string;

        floor: {

          number: string;

          building: {

            name: string;
            society: { name: string };
          }
        }
      }
    }];
}



export function ListResidents(props: ListResidentsProps) {
  const apiUrl = environment.apiUrl;
  const [activeResidents, setActiveResidents] = useState<ViewResident[]>([]);
  const [viewResidentOpen, setViewResidentOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQueryName, setSearchQueryName] = useState<string>('');
  const [searchQueryEmail, setSearchQueryEmail] = useState<string>('');
  const [searchQueryPhone, setSearchQueryPhone] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ResidentToDeleteId, setResidentToDeleteId] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [editData, setEditData] = useState<ViewResident | null>(null);
  const [viewData, setViewData] = useState<ViewResident | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const user=useContext(UserContext);

  const societycontext=useContext(SocietyContext);
  console.log("society context:",societycontext);
  console.log("society id:",societycontext?.id);

  const getResidents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/societies/${societycontext?.id}/residents`, {
        withCredentials: true,
        params: {
          pageSize: rowsPerPage,
          pageOffset: page,
          name: searchQueryName,
          email: searchQueryEmail,
          phoneNumber: searchQueryPhone
        },
      });

      const { content, total } = response.data;
      setTotalItems(total);
      setActiveResidents(content);


      const flatResidents = response.data.content;
      console.log(flatResidents)
      setActiveResidents(flatResidents);

    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
    }
  };


  useEffect(() => {
    getResidents();
  }, [page, rowsPerPage, searchQueryName,
    searchQueryEmail,
    searchQueryPhone, user, societycontext])


  const handleFilterChange = () => {
    setPage(0);
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchQueryName,
    searchQueryEmail,
    searchQueryPhone, user]);





  //Resident Update CloseModal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };


  //Search Function
  const handleSearchNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryName(event.target.value);
    getResidents()
  };

  const handleSearchEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryEmail(event.target.value);
    getResidents();
  };

  const handleSearchPhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryPhone(event.target.value);
    getResidents();
  };


  //Building Update Function
  const handleEditClick = (residentId: number) => {
    const selectedResident: ViewResident | undefined = activeResidents.find(
      (resident) => resident.id === residentId
    );

    if (selectedResident) {
      setEditData(selectedResident)
      setSelectedResidentId(residentId);
      setIsEditModalOpen(true);
    }
  };

  //Table Row Select Function 
  const handleRowClick = (residentId: number, event: React.MouseEvent<HTMLTableRowElement>) => {
    const selectedResident: ViewResident | undefined = activeResidents.find(
      (resident) => resident.id === residentId
    );

    if (selectedResident) {
      setViewData(selectedResident)
      setSelectedResident(residentId);
    }
  };


  // Function to open the delete confirmation modal
  const openDeleteModal = (residentId: number) => {
    setResidentToDeleteId(residentId);
    setIsDeleteModalOpen(true);
  };

  // Function to close the delete confirmation modal
  const closeDeleteModal = () => {
    setResidentToDeleteId(null);
    setIsDeleteModalOpen(false);
  };


  //Pagination
  const handleChangePage = (event: any, newPage: number) => {
    console.log('Page changed to:', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    const newRowsPerPage = parseInt(event.target.value);
    console.log('Rows per page changed to:', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setRowsPerPage(newRowsPerPage)
    getResidents();
  };


  // Add Resident
  const handleAddResident = async (formData: Form) => {

    try {
      const { data: responseData } = await axios.post(`${apiUrl}/societies/${societycontext?.id}/buildings/${formData.buildingId}/floors/${formData.floorId}/flats/${formData.flatId}/residents`,
        { name: formData.name, email: formData.email, phoneNumber: formData.phoneNumber, isChild: formData.isChild, type: formData.type, isActive: formData.isActive },
        {
          withCredentials: true,

        },)
      if (responseData) {
        enqueueSnackbar('Resident added successfully', { variant: 'success' });
        setIsAddModalOpen(false);
        getResidents();

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
          isChild: updateData.isChild, type: updateData.flats[0].type, isActive: updateData.isActive, isPrimary:updateData.flats[0].isPrimary
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
        getResidents();
        setIsModalOpen(false)
      } else {
        console.log('Update data not received');
      }
    } catch (error) {
      console.error(error);
      console.log('Something went wrong');
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  };

  //delete a Resident

  // const handleDelete = async (Id: any) => {
  //   try {
  //     const { data } = await axios.post(`${apiUrl}/societies/1/residents/${Id}/false`, null, {
  //       withCredentials: true,
  //     });
  //     console.log(data);
  //     console.log('Resident DeActive successfully')
  //     enqueueSnackbar('Resident Deleted Successfully', { variant: 'success' });
  //     getResidents();
  //   } catch (error) {
  //     console.log(error)
  //     console.log("Something went wrong")
  //   }
  // }


  //Select Particular Table Row Function
  // function handleRowClick(residentid: number, event: React.MouseEvent<HTMLTableRowElement>) {
  //   if (event.target instanceof HTMLElement && event.target.classList.contains('action-button')) {
  //     return;
  //   }
  //   setSelectedResident(residentid)
  // }

  const handleCheckboxChange = (ResidentId: number) => {
    const isSelected = selectedItems.includes(ResidentId);
    if (isSelected) {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => id !== ResidentId)
      );
    } else {
      setSelectedItems((prevSelected) => [...prevSelected, ResidentId]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    // If all items are currently selected, unselect all. Otherwise, select all.
    const allSelected = activeResidents.every((resident) =>
      selectedItems.includes(resident.id)
    );

    if (allSelected) {
      setSelectedItems([]);
    } else {
      const allResidentIds = activeResidents.map((resident) => resident.id);
      setSelectedItems(allResidentIds);
    }
  };


  // BreadCrumbs
  const breadcrumbs = [
    {
      to: `/dashboard/${societycontext?.id}`,
      label: 'Home',
    },
    {
      label: 'Residents',
    },
  ];

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <>
      <Box className={styles['container']}>
        <Breadcrumbs paths={breadcrumbs} />
        <Box className={styles['building_container']}>

          <Box className={styles['btn_container']}>
            <h1 className={styles['h1_tag']}>Residents</h1>
            <Box>
              <AddResidentComponent
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddResident}
              />
            </Box>
            <Box>
              <ViewResidentComponent
                open={viewResidentOpen}
                onClose={() => setViewResidentOpen(false)}
                residentId={selectedResident}
                initialData={viewData}
              />
            </Box>
            {/* <Button variant="contained" color="primary"
              onClick={() => {
                setIsAddModalOpen(true)
              }}
            > + Add</Button> */}
          </Box >

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell><Checkbox
                  {...label}
                  checked={
                    activeResidents.length > 0 &&
                    activeResidents.every((building) =>
                      selectedItems.includes(building.id)
                    )
                  }
                  onChange={handleHeaderCheckboxChange}
                /></TableCell>
                  <TableCell sx={{ border: "hidden" }}>Name
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Email
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Phone Number
                  </TableCell>
                  <TableCell sx={{ border: "hidden" }}>Flat Number</TableCell>
                  <TableCell sx={{ border: "hidden" }}>Building Name</TableCell>
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
                            <SearchIcon color="action" />
                          ),
                        }}
                      />
                    </Box></TableCell>
                  <TableCell>
                    <Box className={styles['search-container']}>
                      <TextField
                        type="text"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: "10px" }}
                        onChange={handleSearchEmailChange}
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
                        onChange={handleSearchPhoneNumberChange}
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
                {Array.isArray(activeResidents) && activeResidents.length > 0 ? (
                  activeResidents.map((resident: ViewResident, index: number) => (
                    <TableRow className={styles['table_row']} onClick={(e) => { handleRowClick(resident.id, e); setViewResidentOpen(true); }} key={index}>
                      <TableCell><Checkbox
                      checked={selectedItems.includes(resident.id)}
                      onChange={() => handleCheckboxChange(resident.id)}
                      {...label}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /></TableCell>
                      <TableCell>{resident.name}
                      </TableCell>
                      <TableCell>{resident.email}
                      </TableCell>
                      <TableCell>{resident.phoneNumber}
                      </TableCell>
                      <TableCell>
                        {resident.flats[0]?.flat?.number}
                      </TableCell>
                      <TableCell>
                        {resident.flats[0]?.flat?.floor?.building?.name}
                      </TableCell>
                      <TableCell align='center'>
                        <EditIcon sx={{ mr: 1 }} className={styles['row-action-button']} onClick={(e) => { e.stopPropagation(); handleEditClick(resident.id) }}>
                          Edit
                        </EditIcon>
                      {/* <DeleteIcon sx={{ ml: 1 }} className="btn btn-danger" color="error" onClick={() =>
                  
                          openDeleteModal(resident.id)
                        }>
                          Delete
                        </DeleteIcon> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell sx={{
                      textAlign: 'center',
                    }} colSpan={5}>No Resident found</TableCell>
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


        <EditResidentComponent
          open={isEditModalOpen}
          onClose={closeEditModal}
          onUpdate={(data) => {
            handleUpdate(data);
            closeEditModal();
          }}
          initialData={editData}
        />

        {/* <DeleteResidentComponent
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={() => {
            handleDelete(ResidentToDeleteId);
            closeDeleteModal();
          }}
        /> */}
      </Box >

    </>
  );
}

export default ListResidents;
